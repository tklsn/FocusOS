import { z } from "zod";
import { ProjectService } from "~~/server/services/project.service";

const bodySchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    resume_note: z
      .string()
      .trim()
      .transform((value) => value || null),
  })
  .partial()
  .refine((body) => Object.keys(body).length > 0);

export default defineLazyEventHandler(() => {
  const __projectService = new ProjectService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const parsed = bodySchema.safeParse(await readBody(event));
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: "Campos 'name' ou 'resume_note' inválidos",
      });
    }

    const project = await __projectService.updateProject(
      user.id,
      getRouterParam(event, "id")!,
      parsed.data,
    );
    if (!project) throw createError({ statusCode: 404 });

    return project;
  });
});
