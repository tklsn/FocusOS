import { users } from "../db/schema";

export class UserService {
  async createUser(
    user: typeof users.$inferInsert,
  ): Promise<typeof users.$inferSelect> {
    const [row] = await db.insert(users).values(user).returning();

    if (!row) {
      throw new Error("Failed to create user");
    }

    return row;
  }

  async findFirst(): Promise<typeof users.$inferSelect | undefined> {
    return db.select().from(users).limit(1).get();
  }
}
