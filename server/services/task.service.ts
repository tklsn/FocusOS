import { tasks } from "../db/schema";
import { and, desc, eq } from "drizzle-orm";

export class TaskService {
  async createTask(
    task: typeof tasks.$inferInsert,
  ): Promise<typeof tasks.$inferSelect> {
    const [row] = await db.insert(tasks).values(task).returning();

    if (!row) {
      throw new Error("Failed to create task");
    }

    return row;
  }

  async findTasksByUserId(
    userId: string,
    status?: (typeof tasks.$inferSelect)["status"],
  ): Promise<(typeof tasks.$inferSelect)[]> {
    const rows = await db
      .select()
      .from(tasks)
      .where(
        status
          ? and(eq(tasks.user_id, userId), eq(tasks.status, status))
          : eq(tasks.user_id, userId),
      )
      .orderBy(desc(tasks.created_at));

    return rows;
  }

  async updateTask(
    userId: string,
    id: string,
    data: Pick<Partial<typeof tasks.$inferInsert>, "title" | "notes">,
  ): Promise<typeof tasks.$inferSelect | undefined> {
    const [row] = await db
      .update(tasks)
      .set(data)
      .where(and(eq(tasks.id, id), eq(tasks.user_id, userId)))
      .returning();

    return row;
  }

  async deleteTask(userId: string, id: string): Promise<boolean> {
    const rows = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.user_id, userId)))
      .returning({ id: tasks.id });

    return rows.length > 0;
  }
}
