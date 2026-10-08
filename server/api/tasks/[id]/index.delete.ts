import { TaskService } from "~~/server/services/task.service";

export default defineLazyEventHandler(() => {
  const __taskService = new TaskService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const deleted = await __taskService.deleteTask(
      user.id,
      getRouterParam(event, "id")!,
    );
    if (!deleted) throw createError({ statusCode: 404 });

    return sendNoContent(event);
  });
});
