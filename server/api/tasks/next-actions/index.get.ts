import { TaskService } from "~~/server/services/task.service";

export default defineLazyEventHandler(() => {
  const __taskService = new TaskService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    return __taskService.findNextActions(user.id);
  });
});
