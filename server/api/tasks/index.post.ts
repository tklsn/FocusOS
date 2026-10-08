import { z } from "zod";
import { TaskService } from "~~/server/services/task.service";

const bodySchema = z.object({
  title: z.string().trim().min(1),
});

export default defineLazyEventHandler(() => {
  const __taskService = new TaskService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const parsed = bodySchema.safeParse(await readBody(event));
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: "Campo 'title' inválido",
      });
    }

    const task = await __taskService.createTask({
      user_id: user.id,
      title: parsed.data.title,
    });

    return task;
  });
});
