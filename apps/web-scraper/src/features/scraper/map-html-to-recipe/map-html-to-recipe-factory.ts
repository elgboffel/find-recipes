import {
  mapArlaHtmlToRecipe,
  MapHtmlToRecipeStrategy,
  mapSpisBedreHtmlToRecipe,
  mapValdemarsroHtmltoRecipe,
} from "./map-html-to-recipe-strategy";
import { Domains } from "../../../crawlerSettings";

export function mapHtmlToRecipeFactory(
  domain: string,
): MapHtmlToRecipeStrategy | null {
  if (Domains.Valdemarsro === domain) {
    return mapValdemarsroHtmltoRecipe;
  }

  if (Domains.SpisBedre === domain) {
    return mapSpisBedreHtmlToRecipe;
  }

  if (Domains.Arla === domain) {
    return mapArlaHtmlToRecipe;
  }

  return null;
}
