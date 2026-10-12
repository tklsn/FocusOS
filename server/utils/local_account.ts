import { and, eq } from "drizzle-orm";
import { ulid } from "ulid";
import { accounts, users } from "../db/schema";
import { accountService } from "../services/account.service";
import { userService } from "../services/user.service";

const LOCAL_EMAIL = "user@local.local";

export async function createLocalAccount(): Promise<void> {
  const usr: typeof users.$inferInsert = {
    id: ulid(),
    email: LOCAL_EMAIL,
    username: "user",
    name: "User Local",
  };

  const user = await userService.createUser(usr);

  const acc: typeof accounts.$inferInsert = {
    id: ulid(),
    user_id: user.id,
    provider: "credential",
    provider_account_id: user.email,
  };

  await accountService.createAccount(acc);
}

export async function loadLocalAccount() {
  const account = db
    .select()
    .from(accounts)
    .where(
      and(
        eq(accounts.provider, "credential"),
        eq(accounts.provider_account_id, LOCAL_EMAIL),
      ),
    )
    .get();
  return account;
}
