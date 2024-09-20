import { query, type Site } from "/lib/xp/content";
import { forceArray } from "./utils";
import { list, type Repository } from "/lib/xp/repo";
import { type ContextParams, run } from "/lib/xp/context";
import type { SiteConfig } from "/site/index";

function getSites<Config extends object>(): Site<Config>[] {
  return query<Site<Config>>({
    query: `_path LIKE '/content/*' AND data.siteConfig.applicationKey = '${app.name}'`,
    contentTypes: ["portal:site"]
  }).hits;
}

export const runInDraftContext = (callback: () => void, repository: string, params: []) => {
  if (!repository) {
    repository = "com.enonic.cms.default"; // Best guess... This shouldn't happen!
  }

  const context: ContextParams = {
    repository: repository,
    branch: "draft",
    principals: ["role:system.admin"],
    user: {
      login: "su"
    }
  };

  return run(context, () => callback(...params));
};

export function getSiteConfigsInCron(): SiteConfig[] {
  const siteConfigs: SiteConfig[] = [];
  const repolist: Repository[] = list();
  const filteredRepolist = repolist.filter( (repository) => repository.branches.indexOf("draft") >= 0 )
    .map( (repository) => repository.id );

  filteredRepolist.forEach(repository => {
    runInDraftContext(() => {
      const sites = getSites();
      sites.forEach((site) => {
        const ntbAppGeneralSiteConfig = forceArray(site?.data?.siteConfig).filter((cfg) => cfg.applicationKey === app.name)[0];
        siteConfigs.push(ntbAppGeneralSiteConfig.config as SiteConfig);
      });
    }, repository, []);
  });

  return siteConfigs;
}
