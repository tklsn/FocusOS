import { z } from "zod";
import { taskService } from "~~/server/services/task.service";

const bodySchema = z.object({
  ids: z.array(z.string().min(1)).max(1000),
});

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);
  const { ids } = await readValidatedBody(event, bodySchema.parse);

  await taskService.reorderProjectTasks(
    user.id,
    getRouterParam(event, "id")!,
    ids,
  );

  return sendNoContent(event);
});
