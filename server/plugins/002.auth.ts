import { ensureLocalUser } from "../utils/current-user";

export default defineNitroPlugin(() => {
  if (process.env.APP_MODE === "local") ensureLocalUser();
});
