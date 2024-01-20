import { CrawlerSettings } from "@project/web-crawler";

export enum Domains {
  Valdemarsro = "https://www.valdemarsro.dk",
  SpisBedre = "https://spisbedre.dk",
  Arla = "https://arla.dk",
}

export const crawlersSetting: CrawlerSettings[] = [
  // {
  //   domain: Domains.Valdemarsro,
  //   startUrl: Domains.Valdemarsro,
  //   name: "Valdemarsro",
  // },
  {
    domain: Domains.SpisBedre,
    startUrl: Domains.SpisBedre + "/kategorier",
    name: "Spis Bedre",
    skipRules: (url) => !url.includes("/opskrifter/") && !url.includes("/kategorier/"),
    refSkipRules: () => true,
  },
  // {
  //   domain: Domains.Arla,
  //   startUrl: Domains.Arla + "/opskrifter/",
  //   name: "Arla",
  //   skipRules: (url) => !url.includes("/opskrifter/"),
  // },
];
