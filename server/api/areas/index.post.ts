import { areaService } from "~~/server/services/area.service";

const bodySchema = areaSchema.partial({ color: true, icon: true });

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);
  const data = await readValidatedBody(event, bodySchema.parse);

  return areaService.createArea(user.id, data);
});
