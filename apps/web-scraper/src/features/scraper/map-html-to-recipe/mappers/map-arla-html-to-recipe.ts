import { MapHtmlToRecipeStrategy } from "../map-html-to-recipe-strategy";

export const mapArlaHtmlToRecipe: MapHtmlToRecipeStrategy = (html, data) => {
  const urlObj = new URL(data.url);

  return {
    recipe: {
      title: html.querySelector("h1")?.innerHTML ?? null,
      description:
        html.querySelector(".c-recipe__description")?.innerHTML ?? null,
      instructions: html.querySelector(".how-to--steps")?.innerHTML ?? null,
      url: urlObj.href,
      originDomain: urlObj.origin,
    },
    categories: [],
    stats: [],
    ingredients: [],
  };
};

// const getIngredients = (html: HTMLElement): AddRecipe["ingredients"] => {
//   const parentElement = html.querySelector(".ingredientlist");
//   const firstChild = parentElement?.getElementsByTagName("li")?.[0];
//   const ingredientCollections: {
//     title: string | null;
//     collection: string[];
//   }[] = [];
//
//   if (
//     firstChild !== undefined &&
//     !firstChild.classNames.includes("ingredient-header")
//   ) {
//     const collection: string[] = [];
//     let currentElement = firstChild;
//
//     while (currentElement?.getAttribute("itemprop") === "recipeIngredient") {
//       collection.push(currentElement.innerHTML);
//
//       currentElement = currentElement.nextElementSibling;
//     }
//
//     ingredientCollections.push({ title: null, collection });
//   }
//
//   parentElement?.querySelectorAll(".ingredient-header").map((x) => {
//     const collection: string[] = [];
//     let currentElement = x.nextElementSibling;
//
//     while (currentElement?.getAttribute("itemprop") === "recipeIngredient") {
//       collection.push(currentElement.innerHTML);
//
//       currentElement = currentElement.nextElementSibling;
//     }
//
//     ingredientCollections.push({ title: x?.innerHTML ?? null, collection });
//   });
//
//   return ingredientCollections;
// };
