import { and, asc, desc, eq, inArray, lt, max, ne } from "drizzle-orm";
import type { SQLWrapper } from "drizzle-orm";
import { startOfLocalDay } from "../../shared/utils/day";
import { projects, tasks } from "../db/schema";
import { db } from "../utils/db";

type Task = typeof tasks.$inferSelect;

// O que dá para mudar em uma tarefa existente. `done` e `today` são comandos:
// o serviço decide status, datas e marcas a partir deles.
export type TaskChanges = {
  title?: string;
  notes?: string | null;
  implementation_intention?: string | null;
  project_id?: string;
  done?: boolean;
  is_next_action?: boolean;
  today?: boolean;
};

export class TaskService {
  // Sem projeto a tarefa nasce na Inbox; com projeto, no fim da lista dele.
  // Devolve undefined se o projeto não for do usuário.
  async createTask(
    userId: string,
    title: string,
    projectId?: string,
  ): Promise<Task | undefined> {
    if (!projectId) {
      return db
        .insert(tasks)
        .values({ user_id: userId, title })
        .returning()
        .get();
    }

    const sortOrder = this.nextSortOrder(userId, projectId);
    if (sortOrder === undefined) return undefined;

    return db
      .insert(tasks)
      .values({
        user_id: userId,
        project_id: projectId,
        title,
        status: "todo",
        sort_order: sortOrder,
      })
      .returning()
      .get();
  }

  // Posição para uma tarefa nova no fim do projeto; undefined se o projeto não
  // for do usuário.
  private nextSortOrder(userId: string, projectId: string): number | undefined {
    const project = db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.user_id, userId)))
      .get();
    if (!project) return undefined;

    const last = db
      .select({ value: max(tasks.sort_order) })
      .from(tasks)
      .where(eq(tasks.project_id, projectId))
      .get();

    return (last?.value ?? -1) + 1;
  }

  async findTasksByUserId(
    userId: string,
    filter: { status?: Task["status"]; project_id?: string } = {},
  ): Promise<Task[]> {
    return db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.user_id, userId),
          filter.status ? eq(tasks.status, filter.status) : undefined,
          filter.project_id
            ? eq(tasks.project_id, filter.project_id)
            : undefined,
        ),
      )
      .orderBy(
        ...(filter.project_id
          ? [asc(tasks.sort_order), asc(tasks.id)]
          : [desc(tasks.created_at)]),
      );
  }

  // Única porta de escrita em uma tarefa existente. Tudo ou nada: devolve
  // undefined, sem gravar, se a tarefa ou o projeto de destino não forem do
  // usuário, ou se pedirem próxima ação para tarefa sem projeto ou concluída.
  async updateTask(
    userId: string,
    id: string,
    changes: TaskChanges,
  ): Promise<Task | undefined> {
    const { project_id, done, is_next_action, today, ...fields } = changes;

    return db.transaction((tx) => {
      const current = tx
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, id), eq(tasks.user_id, userId)))
        .get();
      if (!current) return undefined;

      let next: Partial<typeof tasks.$inferInsert> = fields;

      // Mover para um projeto: entra no fim da lista dele, como "a fazer".
      if (project_id) {
        const sortOrder = this.nextSortOrder(userId, project_id);
        if (sortOrder === undefined) return undefined;
        next = { ...next, project_id, status: "todo", sort_order: sortOrder };
      }
      const projectId = next.project_id ?? current.project_id;

      // Concluir tira a marca de próxima ação; reabrir devolve para a Inbox
      // ou para a lista do projeto.
      if (done === true) {
        next = {
          ...next,
          status: "done",
          completed_at: new Date(),
          is_next_action: false,
        };
      }
      if (done === false) {
        next = {
          ...next,
          status: projectId ? "todo" : "inbox",
          completed_at: null,
        };
      }

      // Uma próxima ação por projeto: marcar (ou desmarcar) tira a anterior.
      if (is_next_action !== undefined) {
        const status = next.status ?? current.status;
        if (!projectId || status === "done") return undefined;

        tx.update(tasks)
          .set({ is_next_action: false })
          .where(
            and(
              eq(tasks.project_id, projectId),
              eq(tasks.is_next_action, true),
            ),
          )
          .run();
        next = { ...next, is_next_action };
      }

      // "Hoje" guarda o momento da marcação; tirar de hoje apaga.
      if (today !== undefined) {
        next = { ...next, scheduled_for: today ? new Date() : null };
      }

      return tx
        .update(tasks)
        .set(next)
        .where(eq(tasks.id, id))
        .returning()
        .get();
    });
  }

  // Uma tarefa por projeto ativo: a marcada como próxima ação ou, sem marcação,
  // a primeira não concluída da lista. Marcadas vêm antes.
  async findNextActions(userId: string): Promise<Task[]> {
    const rows = await db
      .select({ task: tasks })
      .from(tasks)
      .innerJoin(projects, eq(tasks.project_id, projects.id))
      .where(
        and(
          eq(tasks.user_id, userId),
          ne(tasks.status, "done"),
          eq(projects.status, "active"),
        ),
      )
      .orderBy(
        desc(tasks.is_next_action),
        asc(projects.created_at),
        asc(tasks.sort_order),
        asc(tasks.id),
      );

    const seen = new Set<string | null>();
    return rows
      .map((row) => row.task)
      .filter((task) => {
        if (seen.has(task.project_id)) return false;
        seen.add(task.project_id);
        return true;
      });
  }

  // Grava a posição de cada id; ids de outro usuário ou projeto são ignorados.
  async reorderProjectTasks(
    userId: string,
    projectId: string,
    ids: string[],
  ): Promise<void> {
    db.transaction((tx) => {
      ids.forEach((id, index) => {
        tx.update(tasks)
          .set({ sort_order: index })
          .where(
            and(
              eq(tasks.id, id),
              eq(tasks.user_id, userId),
              eq(tasks.project_id, projectId),
            ),
          )
          .run();
      });
    });
  }

  // Chamado antes de excluir projetos: as tarefas não concluídas voltam para a
  // Inbox em vez de sumirem (as concluídas só perdem o vínculo, pelo FK).
  async moveToInbox(
    userId: string,
    projectIds: string[] | SQLWrapper,
  ): Promise<void> {
    await db
      .update(tasks)
      .set({ project_id: null, status: "inbox", is_next_action: false })
      .where(
        and(
          eq(tasks.user_id, userId),
          ne(tasks.status, "done"),
          inArray(tasks.project_id, projectIds as string[]),
        ),
      );
  }

  async deleteTask(userId: string, id: string): Promise<boolean> {
    const rows = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.user_id, userId)))
      .returning({ id: tasks.id });

    return rows.length > 0;
  }

  // Não concluídas marcadas para hoje ou antes: o que ficou de ontem aparece
  // hoje, sem regravar a data.
  async findToday(userId: string, now = new Date()): Promise<Task[]> {
    const today = startOfLocalDay(now);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.user_id, userId),
          ne(tasks.status, "done"),
          lt(tasks.scheduled_for, tomorrow),
        ),
      )
      .orderBy(asc(tasks.scheduled_for), asc(tasks.id));
  }
}

export const taskService = new TaskService();
