import { TaskService } from "~~/server/services/task.service";
import { UserService } from "~~/server/services/user.service";

export default defineLazyEventHandler(() => {
  const __taskService = new TaskService();
  const __userService = new UserService();

  return defineEventHandler(async () => {
    const user = await __userService.findFirst();

    const tasks = await __taskService.findTasksByUserId(user!.id);

    return tasks;
  });
});
