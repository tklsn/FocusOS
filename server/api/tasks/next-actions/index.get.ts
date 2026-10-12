import { taskService } from "~~/server/services/task.service";

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);

  return taskService.findNextActions(user.id);
});
