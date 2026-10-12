import { z } from "zod";
import { taskService } from "~~/server/services/task.service";

const bodySchema = z.object({
  title: z.string().trim().min(1),
  project_id: z.string().min(1).optional(),
});

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);
  const { title, project_id } = await readValidatedBody(
    event,
    bodySchema.parse,
  );

  const task = await taskService.createTask(user.id, title, project_id);
  if (!task) {
    throw createError({ statusCode: 404, message: "Projeto não encontrado" });
  }

  return task;
});
