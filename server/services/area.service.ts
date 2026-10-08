import { areas, projects } from "../db/schema";
import { and, asc, eq } from "drizzle-orm";
import { TaskService } from "./task.service";

const taskService = new TaskService();

type AreaFields = Pick<typeof areas.$inferInsert, "name" | "color" | "icon">;

export class AreaService {
  async findAreasByUserId(
    userId: string,
  ): Promise<(typeof areas.$inferSelect)[]> {
    return db
      .select()
      .from(areas)
      .where(eq(areas.user_id, userId))
      .orderBy(asc(areas.sort_order), asc(areas.id));
  }

  async createArea(
    userId: string,
    data: AreaFields,
  ): Promise<typeof areas.$inferSelect> {
    const [row] = await db
      .insert(areas)
      .values({ ...data, user_id: userId })
      .returning();

    if (!row) {
      throw new Error("Failed to create area");
    }

    return row;
  }

  async updateArea(
    userId: string,
    id: string,
    data: Partial<AreaFields>,
  ): Promise<typeof areas.$inferSelect | undefined> {
    const [row] = await db
      .update(areas)
      .set(data)
      .where(and(eq(areas.id, id), eq(areas.user_id, userId)))
      .returning();

    return row;
  }

  // Os projetos da área saem junto (FK cascade); as tarefas deles voltam para a Inbox.
  async deleteArea(userId: string, id: string): Promise<boolean> {
    await taskService.moveToInbox(
      userId,
      db
        .select({ id: projects.id })
        .from(projects)
        .where(and(eq(projects.area_id, id), eq(projects.user_id, userId))),
    );

    const rows = await db
      .delete(areas)
      .where(and(eq(areas.id, id), eq(areas.user_id, userId)))
      .returning({ id: areas.id });

    return rows.length > 0;
  }
}
