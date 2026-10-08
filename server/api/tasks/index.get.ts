import { z } from "zod";
import { TaskService } from "~~/server/services/task.service";
import { TASK_STATUSES } from "~~/server/db/schema";

const querySchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  project_id: z.string().min(1).optional(),
});

export default defineLazyEventHandler(() => {
  const __taskService = new TaskService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const parsed = querySchema.safeParse(getQuery(event));
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: "Parâmetros 'status' ou 'project_id' inválidos",
      });
    }

    const tasks = await __taskService.findTasksByUserId(user.id, parsed.data);

    return tasks;
  });
});
