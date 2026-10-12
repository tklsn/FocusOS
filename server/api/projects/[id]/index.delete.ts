import { projectService } from "~~/server/services/project.service";

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);

  const deleted = await projectService.deleteProject(
    user.id,
    getRouterParam(event, "id")!,
  );
  if (!deleted) throw createError({ statusCode: 404 });

  return sendNoContent(event);
});
