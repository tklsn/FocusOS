import { z } from "zod";

export const areaSchema = z.object({
  name: z.string().trim().min(1).max(60),
  color: z.enum(AREA_COLORS),
  icon: z.enum(AREA_ICONS),
});
