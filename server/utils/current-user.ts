import type { H3Event } from "h3";
import { userService } from "../services/user.service";
import { users } from "../db/schema";

export async function getCurrentUser(
  _event: H3Event,
): Promise<typeof users.$inferSelect> {
  const user = await userService.findFirst();
  if (!user)
    throw createError({
      statusCode: 500,
      statusMessage: "Usuário local ausente",
    });
  return user;
}
