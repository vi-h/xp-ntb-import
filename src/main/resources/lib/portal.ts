import { query, type Site } from "/lib/xp/content";
import { forceArray, buildBaseContext } from "./utils";
import { list, type Repository } from "/lib/xp/repo";
import { run } from "/lib/xp/context";
import type { SiteConfig } from "/site/index";

export interface RepoSiteAppConfig {
  repoId: string,
  siteName: string,
  appConfig: SiteConfig,
}

function getSites<Config extends object>(): Site<Config>[] {
  return query<Site<Config>>({
    query: `_path LIKE '/content/*' AND data.siteConfig.applicationKey = '${app.name}'`,
    contentTypes: ["portal:site"]
  }).hits;
}

export const runInDraftRepoContext = (callback: () => void, repositoryId: string, params: []) => {
  if (!repositoryId) {
    repositoryId = "com.enonic.cms.default"; // Best guess... This shouldn't happen!
  }

  return run(buildBaseContext(repositoryId), () => callback(...params));
};

export function getSiteConfigsInCron(): RepoSiteAppConfig[] {
  const siteConfigs: RepoSiteAppConfig[] = [];
  const repolist: Repository[] = list();
  const filteredRepolist = repolist.filter( (repository) => repository.branches.indexOf("draft") >= 0 )
    .map( (repository) => repository.id );

  filteredRepolist.forEach((repositoryId) => {
    runInDraftRepoContext(() => {
      const sites = getSites();
      sites.forEach((site) => {
        const ntbAppGeneralSiteConfig = forceArray(site?.data?.siteConfig).filter((cfg) => cfg.applicationKey === app.name)[0];
        siteConfigs.push({
          repoId: repositoryId,
          siteName: site._name,
          appConfig: ntbAppGeneralSiteConfig.config as SiteConfig
        });
      });
    }, repositoryId, []);
  });

  return siteConfigs;
}
