import { z } from "zod";
import { taskService } from "~~/server/services/task.service";
import { TASK_STATUSES } from "~~/server/db/schema";

const querySchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  project_id: z.string().min(1).optional(),
});

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);
  const filter = await getValidatedQuery(event, querySchema.parse);

  return taskService.findTasksByUserId(user.id, filter);
});
