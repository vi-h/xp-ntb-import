import { query, Site } from "/lib/xp/content";
import { run } from "/lib/xp/context";
import { forceArray } from "./utils";

export function getSiteInCron<Config extends object>(): Site<Config> {
  return run({
    branch: "draft",
    principals: ["role:system.admin"],
    user: {
      login: "su",
      idProvider: "system",
    },
    repository: 'com.enonic.cms.entra-nettside',
  }, () => query<Site<Config>>({
    count: 1,
    query: `_path LIKE '/content/*' AND data.siteConfig.applicationKey = '${app.name}'`,
    contentTypes: ["portal:site"],
  }).hits[0]);
}

export function getSiteConfigInCron<Config extends object>(): Config {
  const site = getSiteInCron<Config>();
  log.info("------NTB import------");
  const myVar = "Test min variabel!";
  log.info(`myVar: ${myVar}`);
  log.info(`site: ${JSON.stringify(site, null, 2)}`);
  log.info(`forceArray(site?.data?.siteConfig): ${JSON.stringify(forceArray(site?.data?.siteConfig), null, 2)}`);
  log.info(`app.name: ${app.name}`);
  log.info(`Filtered: ${JSON.stringify(forceArray(site?.data?.siteConfig).filter((cfg) => cfg.applicationKey === app.name), null, 2)}`);

  return forceArray(site?.data?.siteConfig).filter((cfg) => cfg.applicationKey === app.name)[0].config;
}

/*
Generell mulighet:

export function runSync() {
  // Get all repos that have a draft branch
  const repolist = repoLib.list()
    .filter( (repository) => repository.branches.indexOf("draft") >= 0 )
    .map( (repository) => repository.id );

  // Loop through all repos and register an update task if the Airtable app is installed on the site
  repolist.forEach(repository => {
    runInDraftContext(() => {
      const sites = getSites().hits;
      sites.forEach( (site) => {
        const { _id: siteId = "", _name: siteName = "" } = site;
        // Submit task for the relevant site and relevant repository
        taskLib.submitTask({
          descriptor: "updateSync",
          config: { siteId, siteName, repository: repository }
        });
      });

    }, repository, ["List repos with Airtable app."]);
  });
}
 */
