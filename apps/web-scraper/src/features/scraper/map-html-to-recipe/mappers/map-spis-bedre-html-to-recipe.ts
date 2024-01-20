import { tryParseJson } from "@project/common";
import { MapHtmlToRecipeStrategy } from "../map-html-to-recipe-strategy";

export const mapSpisBedreHtmlToRecipe: MapHtmlToRecipeStrategy = (html, data) => {
  const urlObj = new URL(data.url);

  const pageData = html.getAttribute("data-page");

  if (!pageData) return null;

  const pageDataObj = tryParseJson(pageData);

  if (!pageDataObj?.props?.recipe) return null;

  return {
    recipe: {
      title: pageDataObj.props.recipe.title ?? null,
      description: pageDataObj.props.recipe.description ?? null,
      image: pageDataObj.props.recipe.media?.raw_url ?? null,
      instructions: null,
      url: urlObj.href,
      originDomain: urlObj.origin,
    },
    categories: pageDataObj.props.recipe.tags?.map((x: any) => ({
      name: x.name ?? null,
      key: x.name?.toLowerCase().replace(" ", "-") ?? null,
    })),
    stats: [],
    ingredients: pageDataObj.props.recipe.grouped_ingredients?.map((x: any) => ({
      title: x.title ?? null,
      collection: x.ingredients.map(
        (i: any) =>
          `${i.amount * 4} ${i.amount * 4 > 1 ? i.unit?.name_plural : i.unit?.name_singular} ${i.amount * 4 > 1 ? i.ingredient?.name_plural : i.ingredient?.name_singular}`
      ),
    })),
  };
};
