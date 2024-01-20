import { addRecipe, IDatabase } from "@project/database";
import "dotenv/config";

// import { data as valdemarsroData } from "../../../__generated/valdemarsro-data";

export async function seedDatabase(db: IDatabase) {
  // const collection = valdemarsroData;
  // for (const element of collection) {
  //   try {
  //     await addRecipe({
  //       recipe: {
  //         title: element.title,
  //         url: element.url,
  //         description: element.description,
  //         instructions: element.instructions,
  //       },
  //       categories: element.categories,
  //       ingredients: element.ingredient,
  //       stats: element.stat,
  //       db,
  //     });
  //   } catch (e) {
  //     console.error(`Failed to add recipe with error.`, e);
  //   }
  // }
}
