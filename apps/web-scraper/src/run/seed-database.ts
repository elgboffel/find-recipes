import { Database } from "@project/database";
import "dotenv/config";
import { seedDatabase } from "../features/valdemarsro/seed-database";

async function main() {
  const { db, dispose } = Database.getInstance();

  await seedDatabase(db);

  dispose();
}

main();
