import { z } from "zod";
import { projectService } from "~~/server/services/project.service";

const bodySchema = z.object({
  area_id: z.string().min(1),
  name: z.string().trim().min(1).max(100),
});

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);
  const data = await readValidatedBody(event, bodySchema.parse);

  const project = await projectService.createProject(user.id, data);
  if (!project) {
    throw createError({ statusCode: 404, message: "Área não encontrada" });
  }

  return project;
});
