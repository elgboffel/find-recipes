import { sequence } from "astro:middleware";
import { memoryCache } from "./cache.ts";

export const onRequest = sequence(memoryCache);
