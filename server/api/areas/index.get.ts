import { areaService } from "~~/server/services/area.service";

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);

  return areaService.findAreasByUserId(user.id);
});
