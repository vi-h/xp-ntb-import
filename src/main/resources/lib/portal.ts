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

  return forceArray(site?.data?.siteConfig).filter((cfg) => cfg.applicationKey === app.name)[0].config;
}
