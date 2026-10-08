import { AreaService } from "~~/server/services/area.service";

const bodySchema = areaSchema.partial({ color: true, icon: true });

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

    return __areaService.createArea(user.id, parsed.data);
  });
});
