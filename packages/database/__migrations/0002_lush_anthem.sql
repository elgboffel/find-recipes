ALTER TABLE "Ingredient" RENAME TO "ingredient";--> statement-breakpoint
ALTER TABLE "Stat" RENAME TO "stat";--> statement-breakpoint
ALTER TABLE "ingredient" DROP CONSTRAINT "Ingredient_recipe_id_recipe_id_fk";
--> statement-breakpoint
ALTER TABLE "stat" DROP CONSTRAINT "Stat_recipe_id_recipe_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stat" ADD CONSTRAINT "stat_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
