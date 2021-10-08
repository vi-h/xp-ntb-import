import { query, Site } from "/lib/xp/content";
import { forceArray } from "./utils";

export function getSiteInCron<Config extends object>(): Site<Config> {
  return query<Config>({
    count: 1,
    query: `_path LIKE '/content/*' AND data.siteConfig.applicationKey = '${app.name}'`,
    contentTypes: ["portal:site"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }).hits[0] as any;
}

export function getSiteConfigInCron<Config extends object>(): Config {
  const site = getSiteInCron<Config>();

  return forceArray(site?.data?.siteConfig).filter((cfg) => cfg.applicationKey === app.name)[0].config;
}
