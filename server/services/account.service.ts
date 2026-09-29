import { accounts } from "../db/schema";

export class AccountService {
  async createAccount(
    account: typeof accounts.$inferInsert,
  ): Promise<typeof accounts.$inferSelect> {
    const [row] = await db.insert(accounts).values(account).returning();

    if (!row) {
      throw new Error("Failed to create account");
    }

    return row;
  }
}
