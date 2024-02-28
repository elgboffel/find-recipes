import { AddRecipe } from "@project/database";
import { HTMLElement } from "node-html-parser";
import { MapHtmlToRecipeStrategy } from "../map-html-to-recipe-strategy";

export const mapValdemarsroHtmlToRecipe: MapHtmlToRecipeStrategy = (html, data) => {
  const urlObj = new URL(data.url);

  return {
    recipe: {
      title: html.querySelector('h2[itemprop="name"]')?.innerHTML ?? null,
      description:
        html.querySelectorAll('div[itemprop="description"] > p').join("") ?? null,
      image: html.querySelector('img[itemprop="image"]')?.getAttribute("src") ?? null,
      instructions:
        html.querySelector('div[itemprop="recipeInstructions"]')?.innerHTML ?? null,
      url: urlObj.href,
      originDomain: urlObj.origin,
    },
    categories: [
      ...html.querySelectorAll('span[itemprop="recipeCategory"]').map((x) => ({
        name: x.innerHTML ?? null,
        key: x.innerHTML.toLowerCase().replace(" ", "-") ?? null,
      })),
      ...html
        .querySelectorAll('span[itemprop="keywords"]')
        .map((x) =>
          x?.innerHTML.split(", ").map((i) => ({
            name: i,
            key: i.toLowerCase().replace(" ", "-") ?? null,
          }))
        )
        .flat(),
    ],
    stats: [
      ...html.querySelectorAll(".recipe-stat").map((x) => ({
        label: x.querySelector("span")?.innerHTML ?? null,
        text: x.querySelector("strong")?.text ?? null,
      })),
    ],
    ingredients: getIngredients(html),
  };
};

const getIngredients = (html: HTMLElement): AddRecipe["ingredients"] => {
  const parentElement = html.querySelector(".ingredientlist");
  const firstChild = parentElement?.getElementsByTagName("li")?.[0];
  const ingredientCollections: {
    title: string | null;
    collection: string[];
  }[] = [];

  if (firstChild !== undefined && !firstChild.classNames.includes("ingredient-header")) {
    const collection: string[] = [];
    let currentElement = firstChild;

    while (currentElement?.getAttribute("itemprop") === "recipeIngredient") {
      collection.push(currentElement.innerHTML);

      currentElement = currentElement.nextElementSibling;
    }

    ingredientCollections.push({ title: null, collection });
  }

  parentElement?.querySelectorAll(".ingredient-header").map((x) => {
    const collection: string[] = [];
    let currentElement = x.nextElementSibling;

    while (currentElement?.getAttribute("itemprop") === "recipeIngredient") {
      collection.push(currentElement.innerHTML);

      currentElement = currentElement.nextElementSibling;
    }

    ingredientCollections.push({ title: x?.innerHTML ?? null, collection });
  });

  return ingredientCollections;
};
