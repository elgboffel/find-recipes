import { Error, fetcher } from "@project/common";
import parse from "node-html-parser";

export async function scraper(urls: string[]) {
  const failedPages: string[] = [];
  const recipes = [];

  for (const url of urls) {
    const res = await fetcher<string>({ url, isText: true });

    if (!res || res instanceof Error) {
      failedPages.push(url);
      continue;
    }

    const html = parse(res);

    if (!html.querySelector(".post-recipe")) continue;

    // const data = mapValdemarsroHtmlToSeedData(html, url);

    recipes.push({});
  }

  console.warn(`Failed pages ${failedPages}`);

  return {
    recipes,
    failedPages,
  };
}
