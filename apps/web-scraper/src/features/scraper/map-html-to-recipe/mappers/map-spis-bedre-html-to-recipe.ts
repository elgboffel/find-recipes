import { MapHtmlToRecipeStrategy } from "../map-html-to-recipe-strategy";

export const mapSpisBedreHtmlToRecipe: MapHtmlToRecipeStrategy = (
  html,
  data,
) => {
  const urlObj = new URL(data.url);

  return {
    recipe: {
      title: html.querySelector('h2[itemprop="name"]')?.innerHTML ?? null,
      description:
        html.querySelector('p[itemprop="description"]')?.innerHTML ?? null,
      image:
        html
          .querySelector('div[itemprop="image"] > img')
          ?.getAttribute("src") ?? null,
      instructions:
        html.querySelectorAll('div[itemprop="recipeInstructions"]')?.join("") ??
        null,
      url: urlObj.href,
      originDomain: urlObj.origin,
    },
    categories: [],
    stats: [],
    ingredients: [],
  };
};

// const getIngredients = (html: HTMLElement): AddRecipe["ingredients"] => {
//   const parentElement = html.querySelector("div[data-type='ingredients']");
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
