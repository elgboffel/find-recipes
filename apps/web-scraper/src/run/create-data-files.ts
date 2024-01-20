import { createFile } from "@project/common-server";
import { crawler } from "@project/web-crawler";
import { data } from "../../__generated/spis-bedre-urls.ts";
import { crawlersSetting } from "../crawlerSettings";
import { scraper } from "../features/scraper";

export async function main() {
  for (const settings of crawlersSetting) {
    // const crawlerData = await crawler({
    //   url: settings.startUrl,
    //   settings,
    //   ref: settings.startUrl,
    // });
    //
    // if (!crawlerData) throw new Error("No crawler data found");
    //
    // const data = Array.from(crawlerData).map(([, data]) => data);
    //
    // createFile(
    //   `${settings.name.toLowerCase().replace(" ", "-")}-url.ts`,
    //   "__generated",
    //   `export const data: Array<{ url: string; urlRefs: string[]; hits: number; }> = ${JSON.stringify(
    //     data
    //   )}`
    // );

    console.log("Start scraping");

    const { recipes, failedPages } = await scraper(data, settings);
    console.log({ failedPages });
    console.log(`Pages scraped: ${recipes.length}`);

    createFile(
      `${settings.name.toLowerCase().replace(" ", "-")}-data.ts`,
      "__generated",
      `export const data = ${JSON.stringify(recipes)}`
    );
  }
}

main();
