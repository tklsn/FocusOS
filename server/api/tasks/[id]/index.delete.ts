import { taskService } from "~~/server/services/task.service";

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);

  const deleted = await taskService.deleteTask(
    user.id,
    getRouterParam(event, "id")!,
  );
  if (!deleted) throw createError({ statusCode: 404 });

  return sendNoContent(event);
});
