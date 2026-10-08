import { AreaService } from "~~/server/services/area.service";

export default defineLazyEventHandler(() => {
  const __areaService = new AreaService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const deleted = await __areaService.deleteArea(
      user.id,
      getRouterParam(event, "id")!,
    );
    if (!deleted) throw createError({ statusCode: 404 });

    return sendNoContent(event);
  });
});
