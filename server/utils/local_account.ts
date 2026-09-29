import { and, eq } from "drizzle-orm";
import { ulid } from "ulid";
import { accounts, users } from "../db/schema";
import { AccountService } from "../services/account.service";
import { UserService } from "../services/user.service";

const LOCAL_EMAIL = "user@local.local";

const __accountService = new AccountService();
const __userService = new UserService();

export async function createLocalAccount(): Promise<void> {
  const usr: typeof users.$inferInsert = {
    id: ulid(),
    email: LOCAL_EMAIL,
    username: "user",
    name: "User Local",
  };

  const user = await __userService.createUser(usr);

  const acc: typeof accounts.$inferInsert = {
    id: ulid(),
    user_id: user.id,
    provider: "credential",
    provider_account_id: user.email,
  };

  await __accountService.createAccount(acc);
}

export async function loadLocalAccount() {
  return db
    .select()
    .from(accounts)
    .where(
      and(
        eq(accounts.provider, "credential"),
        eq(accounts.provider_account_id, LOCAL_EMAIL),
      ),
    )
    .get();
}
