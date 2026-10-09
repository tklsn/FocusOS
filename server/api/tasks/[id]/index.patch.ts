import { z } from "zod";
import { TaskService } from "~~/server/services/task.service";

const bodySchema = z
  .object({
    title: z.string().trim().min(1),
    notes: z
      .string()
      .trim()
      .transform((value) => value || null),
    project_id: z.string().min(1),
    done: z.boolean(),
  })
  .partial()
  .refine((body) => Object.keys(body).length > 0);

export default defineLazyEventHandler(() => {
  const __taskService = new TaskService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const parsed = bodySchema.safeParse(await readBody(event));
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: "Campos 'title', 'notes', 'project_id' ou 'done' inválidos",
      });
    }

    const id = getRouterParam(event, "id")!;
    const { project_id, done, ...fields } = parsed.data;

    let task;
    if (project_id) {
      task = await __taskService.moveToProject(user.id, id, project_id);
      if (!task) throw createError({ statusCode: 404 });
    }
    if (done !== undefined) {
      task = await __taskService.setDone(user.id, id, done);
      if (!task) throw createError({ statusCode: 404 });
    }

    if (Object.keys(fields).length > 0) {
      task = await __taskService.updateTask(user.id, id, fields);
    }
    if (!task) throw createError({ statusCode: 404 });

    return task;
  });
});
