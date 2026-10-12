import { and, eq } from "drizzle-orm";
import type { H3Event } from "h3";
import { accounts, users } from "../db/schema";
import { db } from "./db";

// Desktop v1: um único usuário local, sem login (ADR 0003). Toda rota pega o
// usuário daqui, nunca de dados enviados pelo cliente.

const LOCAL_EMAIL = "user@local.local";

// Chamado na subida do servidor: cria o usuário local e a conta dele na
// primeira execução; nas seguintes não faz nada.
export function ensureLocalUser(): void {
  db.transaction((tx) => {
    const account = tx
      .select({ id: accounts.id })
      .from(accounts)
      .where(
        and(
          eq(accounts.provider, "credential"),
          eq(accounts.provider_account_id, LOCAL_EMAIL),
        ),
      )
      .get();
    if (account) return;

    const user = tx
      .insert(users)
      .values({ email: LOCAL_EMAIL, username: "user", name: "User Local" })
      .returning()
      .get();
    tx.insert(accounts)
      .values({
        user_id: user.id,
        provider: "credential",
        provider_account_id: user.email,
      })
      .run();
  });
}

export async function getCurrentUser(
  _event: H3Event,
): Promise<typeof users.$inferSelect> {
  const user = db.select().from(users).limit(1).get();
  if (!user)
    throw createError({
      statusCode: 500,
      statusMessage: "Usuário local ausente",
    });
  return user;
}
