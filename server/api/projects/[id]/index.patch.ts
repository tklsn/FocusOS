import { z } from "zod";
import { projectService } from "~~/server/services/project.service";
import { PROJECT_STATUSES } from "~~/server/db/schema";

const bodySchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    status: z.enum(PROJECT_STATUSES),
    resume_note: z
      .string()
      .trim()
      .transform((value) => value || null),
  })
  .partial()
  .refine((body) => Object.keys(body).length > 0);

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);
  const changes = await readValidatedBody(event, bodySchema.parse);

  const project = await projectService.updateProject(
    user.id,
    getRouterParam(event, "id")!,
    changes,
  );
  if (!project) throw createError({ statusCode: 404 });

  return project;
});
