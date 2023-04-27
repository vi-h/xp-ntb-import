import type { ContextParams } from "/lib/xp/context";
import * as cronLib from "/lib/cron";
import { importFromNtb } from "/lib/ntb-import";

const CRON_EVERY_HOUR = "0 * * * *";

export const context: ContextParams = {
  branch: "draft",
  principals: ["role:system.admin"],
  user: {
    login: "su",
    idProvider: "system",
  },
  repository: "com.enonic.cms.default",
};

cronLib.schedule({
  name: "import-from-ntb",
  cron: CRON_EVERY_HOUR,
  callback: () => importFromNtb(),
  context,
});
