import { CronRunContext } from "/lib/cron";
import * as cronLib from "/lib/cron";
import { importFromNtb } from "./lib/ntb-import";

const CRON_EVERY_HOUR = "0 * * * *";

export const context: CronRunContext = {
  branch: "draft",
  principals: ["role:system.admin"],
  user: {
    login: "su",
    userStore: "system",
  },
  repository: "com.enonic.cms.default",
};

cronLib.schedule({
  name: "import-from-ntb",
  cron: CRON_EVERY_HOUR,
  callback: () => importFromNtb(),
  context,
});
