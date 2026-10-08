import { AreaService } from "~~/server/services/area.service";

const bodySchema = areaSchema
  .partial()
  .refine((body) => Object.keys(body).length > 0);

export default defineLazyEventHandler(() => {
  const __areaService = new AreaService();

  return defineEventHandler(async (event) => {
    const user = await getCurrentUser(event);

    const parsed = bodySchema.safeParse(await readBody(event));
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: "Campos 'name', 'color' ou 'icon' inválidos",
      });
    }

    const area = await __areaService.updateArea(
      user.id,
      getRouterParam(event, "id")!,
      parsed.data,
    );
    if (!area) throw createError({ statusCode: 404 });

    return area;
  });
});
