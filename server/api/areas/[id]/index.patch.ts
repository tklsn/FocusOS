import { areaService } from "~~/server/services/area.service";

const bodySchema = areaSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0);

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);
  const changes = await readValidatedBody(event, bodySchema.parse);

  const area = await areaService.updateArea(
    user.id,
    getRouterParam(event, "id")!,
    changes,
  );
  if (!area) throw createError({ statusCode: 404 });

  return area;
});
