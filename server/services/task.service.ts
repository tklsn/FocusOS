import { projects, tasks } from "../db/schema";
import { and, asc, desc, eq, inArray, max, ne, sql } from "drizzle-orm";
import type { SQLWrapper } from "drizzle-orm";

type Task = typeof tasks.$inferSelect;

export class TaskService {
  async createTask(task: typeof tasks.$inferInsert): Promise<Task> {
    const [row] = await db.insert(tasks).values(task).returning();

    if (!row) {
      throw new Error("Failed to create task");
    }

    return row;
  }

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

  async createProjectTask(
    userId: string,
    projectId: string,
    title: string,
  ): Promise<Task | undefined> {
    const sortOrder = this.nextSortOrder(userId, projectId);
    if (sortOrder === undefined) return undefined;

    return this.createTask({
      user_id: userId,
      project_id: projectId,
      title,
      status: "todo",
      sort_order: sortOrder,
    });
  }

  async moveToProject(
    userId: string,
    id: string,
    projectId: string,
  ): Promise<Task | undefined> {
    const sortOrder = this.nextSortOrder(userId, projectId);
    if (sortOrder === undefined) return undefined;

    const [row] = await db
      .update(tasks)
      .set({ project_id: projectId, status: "todo", sort_order: sortOrder })
      .where(and(eq(tasks.id, id), eq(tasks.user_id, userId)))
      .returning();

    return row;
  }

  async findTasksByUserId(
    userId: string,
    filter: { status?: Task["status"]; project_id?: string } = {},
  ): Promise<Task[]> {
    const rows = await db
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

    return rows;
  }

  async updateTask(
    userId: string,
    id: string,
    data: Pick<Partial<typeof tasks.$inferInsert>, "title" | "notes">,
  ): Promise<Task | undefined> {
    const [row] = await db
      .update(tasks)
      .set(data)
      .where(and(eq(tasks.id, id), eq(tasks.user_id, userId)))
      .returning();

    return row;
  }

  async setDone(
    userId: string,
    id: string,
    done: boolean,
  ): Promise<Task | undefined> {
    const [row] = await db
      .update(tasks)
      .set(
        done
          ? { status: "done", completed_at: new Date(), is_next_action: false }
          : {
              status: sql<
                "inbox" | "todo"
              >`case when ${tasks.project_id} is null then 'inbox' else 'todo' end`,
              completed_at: null,
            },
      )
      .where(and(eq(tasks.id, id), eq(tasks.user_id, userId)))
      .returning();

    return row;
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
      .set({ project_id: null, status: "inbox" })
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
}
