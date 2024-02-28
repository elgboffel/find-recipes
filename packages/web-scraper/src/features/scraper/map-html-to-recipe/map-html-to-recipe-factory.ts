import { Domains } from "../../../crawlerSettings";
import {
  mapArlaHtmlToRecipe,
  MapHtmlToRecipeStrategy,
  mapSpisBedreHtmlToRecipe,
  mapValdemarsroHtmltoRecipe,
} from "./map-html-to-recipe-strategy";

export function mapHtmlToRecipeFactory(domain: string): MapHtmlToRecipeStrategy | null {
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
