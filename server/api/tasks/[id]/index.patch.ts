import { z } from "zod";
import { taskService } from "~~/server/services/task.service";

const optionalText = z
  .string()
  .trim()
  .transform((value) => value || null);

const bodySchema = z
  .object({
    title: z.string().trim().min(1),
    notes: optionalText,
    implementation_intention: optionalText.pipe(z.string().max(200).nullable()),
    project_id: z.string().min(1),
    done: z.boolean(),
    is_next_action: z.boolean(),
    today: z.boolean(),
  })
  .partial()
  .refine((body) => Object.keys(body).length > 0);

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);
  const changes = await readValidatedBody(event, bodySchema.parse);

  const task = await taskService.updateTask(
    user.id,
    getRouterParam(event, "id")!,
    changes,
  );
  if (!task) throw createError({ statusCode: 404 });

  return task;
});
