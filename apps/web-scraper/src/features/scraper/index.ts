import { Error, fetcher } from "@project/common";
import { CrawlData, CrawlerSettings } from "@project/web-crawler";
import parse from "node-html-parser";
import { mapHtmlToRecipeFactory } from "./map-html-to-recipe/map-html-to-recipe-factory";

export async function scraper(data: CrawlData[], crawlerSettings: CrawlerSettings) {
  const failedPages: string[] = [];
  const recipes = [];
  let scraped = 1;

  for (const element of data) {
    const res = await fetcher<string>({ url: element.url, isText: true });

    if (!res || res instanceof Error) {
      failedPages.push(element.url);
      continue;
    }

    const html = parse(res);

    const mapHtmlToRecipe = mapHtmlToRecipeFactory(crawlerSettings.domain);

    if (!mapHtmlToRecipe) continue;

    const recipe = mapHtmlToRecipe(html, element);

    if (!recipe) continue;

    recipes.push(recipe);
    console.info(scraped);
    scraped += 1;
  }

  console.warn(`Failed pages ${failedPages}`);

  return {
    recipes,
    failedPages,
  };
}
