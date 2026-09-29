import { createLocalAccount, loadLocalAccount } from "../utils/local_account";

export default defineNitroPlugin(async () => {
  if (process.env.APP_MODE === "local") {
    const localAccount = await loadLocalAccount();
    if (!localAccount) {
      await createLocalAccount();
    }
  }
});
