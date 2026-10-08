import { z } from "zod";
import { ProjectService } from "~~/server/services/project.service";

const bodySchema = z.object({
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
        message: "Campo 'name' inválido",
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
