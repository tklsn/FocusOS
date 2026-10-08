import { AreaService } from "~~/server/services/area.service";

export default defineLazyEventHandler(() => {
  const __areaService = new AreaService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    return __areaService.findAreasByUserId(user.id);
  });
});
