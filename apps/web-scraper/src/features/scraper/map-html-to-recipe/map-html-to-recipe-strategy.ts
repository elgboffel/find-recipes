import { AddRecipe } from "@project/database";
import { CrawlData } from "@project/web-crawler";
import { HTMLElement } from "node-html-parser";
import { mapArlaHtmlToRecipe as mapArla } from "./mappers/map-arla-html-to-recipe";
import { mapSpisBedreHtmlToRecipe as mapSpisBedre } from "./mappers/map-spis-bedre-html-to-recipe";
import { mapValdemarsroHtmlToRecipe as mapValdemarsro } from "./mappers/map-valdemarsro-html-to-recipe";

export type MapHtmlToRecipeStrategy = (
  html: HTMLElement,
  data: CrawlData
) => AddRecipe | null;

export const mapArlaHtmlToRecipe: MapHtmlToRecipeStrategy = (html, data) => {
  const recipeHtml = html.querySelector('div[data-placement="recipe_page"]');

  if (!recipeHtml) return null;

  return mapArla(recipeHtml, data);
};

export const mapSpisBedreHtmlToRecipe: MapHtmlToRecipeStrategy = (html, data) => {
  const recipeHtml = html.querySelector('div[itemtype="http://schema.org/Recipe"]');

  if (!recipeHtml) return null;

  return mapSpisBedre(recipeHtml, data);
};

export const mapValdemarsroHtmltoRecipe: MapHtmlToRecipeStrategy = (html, data) => {
  const recipeHtml = html.querySelector(".post-recipe");

  if (!recipeHtml) return null;

  return mapValdemarsro(recipeHtml, data);
};
