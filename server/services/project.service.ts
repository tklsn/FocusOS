import { areas, projects } from "../db/schema";
import { and, asc, eq } from "drizzle-orm";
import { TaskService } from "./task.service";

const taskService = new TaskService();

export class ProjectService {
  async findProjectsByUserId(
    userId: string,
  ): Promise<(typeof projects.$inferSelect)[]> {
    return db
      .select()
      .from(projects)
      .where(eq(projects.user_id, userId))
      .orderBy(asc(projects.id));
  }

  async areaHasProjects(userId: string, areaId: string): Promise<boolean> {
    const row = db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.area_id, areaId), eq(projects.user_id, userId)))
      .limit(1)
      .get();

    return !!row;
  }

  async createProject(
    userId: string,
    data: { area_id: string; name: string },
  ): Promise<typeof projects.$inferSelect | undefined> {
    const area = db
      .select({ id: areas.id })
      .from(areas)
      .where(and(eq(areas.id, data.area_id), eq(areas.user_id, userId)))
      .get();
    if (!area) return undefined;

    const [row] = await db
      .insert(projects)
      .values({ ...data, user_id: userId })
      .returning();

    if (!row) {
      throw new Error("Failed to create project");
    }

    return row;
  }

  async updateProject(
    userId: string,
    id: string,
    data: Partial<
      Pick<typeof projects.$inferInsert, "name" | "status" | "resume_note">
    >,
  ): Promise<typeof projects.$inferSelect | undefined> {
    const [row] = await db
      .update(projects)
      .set(
        data.resume_note === undefined
          ? data
          : { ...data, resume_note_updated_at: new Date() },
      )
      .where(and(eq(projects.id, id), eq(projects.user_id, userId)))
      .returning();

    return row;
  }

  async deleteProject(userId: string, id: string): Promise<boolean> {
    await taskService.moveToInbox(userId, [id]);

    const rows = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.user_id, userId)))
      .returning({ id: projects.id });

    return rows.length > 0;
  }
}
