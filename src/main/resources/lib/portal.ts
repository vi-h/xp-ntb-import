import { query, Site } from "/lib/xp/content";
import { forceArray } from "./utils";

export function getSiteInCron<Config extends object>(): Site<Config> {
  return query<Site<Config>>({
    count: 1,
    query: `_path LIKE '/content/*' AND data.siteConfig.applicationKey = '${app.name}'`,
    contentTypes: ["portal:site"],
  }).hits[0];
}

export function getSiteConfigInCron<Config extends object>(): Config {
  const site = getSiteInCron<Config>();
  // TODO: update so we do not choose a random site if there are more sites with the NTB app installed
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
