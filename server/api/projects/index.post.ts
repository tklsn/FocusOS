import { z } from "zod";
import { ProjectService } from "~~/server/services/project.service";

const bodySchema = z.object({
  area_id: z.string().min(1),
  name: z.string().trim().min(1).max(100),
});

export default defineLazyEventHandler(() => {
  const __projectService = new ProjectService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const parsed = bodySchema.safeParse(await readBody(event));
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: "Campos 'area_id' ou 'name' inválidos",
      });
    }

    const project = await __projectService.createProject(user.id, parsed.data);
    if (!project) {
      throw createError({ statusCode: 404, message: "Área não encontrada" });
    }

    return project;
  });
});
