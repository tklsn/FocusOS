import { tasks } from "../db/schema";
import { eq, desc } from "drizzle-orm";

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
  ): Promise<(typeof tasks.$inferSelect)[]> {
    const rows = await db
      .select()
      .from(tasks)
      .where(eq(tasks.user_id, userId))
      .orderBy(desc(tasks.created_at));

    return rows;
  }
}
