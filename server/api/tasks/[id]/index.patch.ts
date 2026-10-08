import { z } from "zod";
import { TaskService } from "~~/server/services/task.service";

const bodySchema = z
  .object({
    title: z.string().trim().min(1),
    notes: z
      .string()
      .trim()
      .transform((value) => value || null),
  })
  .partial()
  .refine((body) => Object.keys(body).length > 0);

export default defineLazyEventHandler(() => {
  const __taskService = new TaskService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const parsed = bodySchema.safeParse(await readBody(event));
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: "Campos 'title' ou 'notes' inválidos",
      });
    }

    const task = await __taskService.updateTask(
      user.id,
      getRouterParam(event, "id")!,
      parsed.data,
    );
    if (!task) throw createError({ statusCode: 404 });

    return task;
  });
});
