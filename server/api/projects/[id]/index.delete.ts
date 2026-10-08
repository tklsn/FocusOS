import { ProjectService } from "~~/server/services/project.service";

export default defineLazyEventHandler(() => {
  const __projectService = new ProjectService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const deleted = await __projectService.deleteProject(
      user.id,
      getRouterParam(event, "id")!,
    );
    if (!deleted) throw createError({ statusCode: 404 });

    return sendNoContent(event);
  });
});
