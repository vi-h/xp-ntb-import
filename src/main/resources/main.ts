import type { ContextParams } from "/lib/xp/context";
import { schedule, unschedule } from "/lib/cron";
import { importFromNtb } from "/lib/ntb-import";
import { getSiteConfigInCron } from "/lib/portal";
import { EnonicEventDataNode, listener } from "/lib/xp/event";
import { SiteConfig } from "/site/index";

const CRON_NAME = "import-from-ntb";
const CRON_EVERY_HOUR = "0 * * * *";

export const context: ContextParams = {
  branch: "draft",
  principals: ["role:system.admin"],
  user: {
    login: "su",
    idProvider: "system",
  },
  repository: 'com.enonic.cms.entra-nettside',
};

// run on deployment
toggleImport();

listener({
  type: "node.updated",
  callback: (event) => {
    const siteWasUpdated = event.data.nodes.some(isRoot);

    if (siteWasUpdated) {
      toggleImport();
    }
  },
});

function toggleImport() {
  const { disableImport } = getSiteConfigInCron<SiteConfig>();

  if (disableImport) {
    unschedule({ name: CRON_NAME });
  } else {
    schedule({
      name: CRON_NAME,
      cron: CRON_EVERY_HOUR,
      callback: () => importFromNtb(),
      context,
    });
  }

  log.info(
    disableImport
      ? `Unscheduled cron job "${CRON_NAME}"`
      : `Create cron job for "${CRON_NAME}" that runs "${CRON_EVERY_HOUR}"`
  );
}

function isRoot(node: EnonicEventDataNode): boolean {
  return node.path.substring(9).indexOf("/") === -1; // is there any "/" after we remove "/content/"?
}
