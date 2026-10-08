import { z } from "zod";
import { TaskService } from "~~/server/services/task.service";

const bodySchema = z.object({
  ids: z.array(z.string().min(1)).max(1000),
});

export default defineLazyEventHandler(() => {
  const __taskService = new TaskService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const parsed = bodySchema.safeParse(await readBody(event));
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: "Campo 'ids' inválido",
      });
    }

    await __taskService.reorderProjectTasks(
      user.id,
      getRouterParam(event, "id")!,
      parsed.data.ids,
    );

    return sendNoContent(event);
  });
});
