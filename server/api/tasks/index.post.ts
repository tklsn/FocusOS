import { TaskService } from "~~/server/services/task.service";
import { UserService } from "~~/server/services/user.service";

export default defineLazyEventHandler(() => {
  const __taskService = new TaskService();
  const __userService = new UserService();

  return defineEventHandler(async (event) => {
    const user = await __userService.findFirst();

    const body = await readBody(event);

    const task = await __taskService.createTask({
      user_id: user!.id,
      title: body.title,
    });

    return task;
  });
});
