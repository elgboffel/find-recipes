import { fetcher, Error } from "@project/common";
import parse from "node-html-parser";
import { HTMLElement } from "node-html-parser";

export type CrawlerSettings = {
  domain: string;
  startUrl: string;
  name: string;
  skipRules?: (url: string) => boolean;
  refSkipRules?: (url: string) => boolean;
  htmlActions?: (html: HTMLElement, url?: string) => void;
};

export type CrawlData = {
  url: string;
  urlRefs: string[];
  hits: number;
};

type CrawlerProps = {
  url: string;
  settings: CrawlerSettings;
  ref?: string;
  skipRules?: (url: string) => boolean;
  crawlData?: Map<string, CrawlData>;
};

export async function crawler({
  url,
  settings,
  ref,
  crawlData = new Map(),
}: CrawlerProps): Promise<Map<string, CrawlData>> {
  const urlObj = createUrlObj(url, settings);
  const refUrlObj = ref ? createUrlObj(ref, settings) : urlObj;

  if (!urlObj || !refUrlObj) return crawlData;

  console.log(`${urlObj.href} - crawled`);
  console.log(crawlData.size);

  //TODO: remove
  if (crawlData.size > 50) return crawlData;

  try {
    const res = await fetcher<string>({ url: urlObj.href, isText: true });

    if (res instanceof Error) return crawlData;

    crawlData.set(urlObj.href, {
      url: urlObj.href,
      urlRefs: [refUrlObj.href],
      hits: 1,
    });

    const html = parse(res);

    const hrefs = html?.querySelectorAll("a")?.map((x) => x.getAttribute("href") ?? null);

    if (settings.htmlActions) settings.htmlActions(html, urlObj.href);

    for (const href of hrefs) {
      if (!href) continue;

      if (
        href == "#" ||
        href.includes("javascript:") ||
        href.includes("mailto:") ||
        href.includes("?")
      ) {
        continue;
      }

      if (settings?.skipRules && settings.skipRules(href)) continue;

      const urlified = createUrlObj(href, settings);

      if (!urlified) continue;

      if (urlified.origin !== urlObj.origin) continue;
      const exists = crawlData.get(urlified.href);

      if (exists) {
        const existingRef = exists.urlRefs;

        if (
          existingRef &&
          !existingRef.includes(urlObj.href) &&
          (settings.refSkipRules ? settings.refSkipRules(urlObj.href) : true)
        )
          existingRef.push(urlObj.href);

        crawlData?.set(urlified.href, {
          url: urlified.href,
          urlRefs: existingRef,
          hits: exists.hits + 1,
        });
        continue;
      }

      await crawler({
        url: urlified.href,
        settings,
        ref: urlObj.href,
        crawlData,
      });
    }
  } catch (e) {
    console.error(e);
    return crawlData;
  }
  return crawlData;
}

function createUrlObj(url: string, settings: CrawlerSettings): URL | null {
  try {
    if (!url.startsWith("http://") && !url.startsWith("https://"))
      return new URL(`${settings.domain}${url.startsWith("/") ? url : "/" + url}`);

    return new URL(url);
  } catch (e) {
    console.error(`Failed get url object from url ${url}`);
    return null;
  }
}
