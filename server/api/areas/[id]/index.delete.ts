import { AreaService } from "~~/server/services/area.service";
import { ProjectService } from "~~/server/services/project.service";

export default defineLazyEventHandler(() => {
  const __areaService = new AreaService();
  const __projectService = new ProjectService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);
    const id = getRouterParam(event, "id")!;

    // Área com projetos só sai com decisão explícita: ?cascade=true apaga os projetos junto.
    if (
      getQuery(event).cascade !== "true" &&
      (await __projectService.areaHasProjects(user.id, id))
    ) {
      throw createError({
        statusCode: 409,
        message: "A área tem projetos; confirme com cascade=true",
      });
    }

    const deleted = await __areaService.deleteArea(user.id, id);
    if (!deleted) throw createError({ statusCode: 404 });

    return sendNoContent(event);
  });
});
