/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    // This will allow us to set the cache duration for each page.
    cache(seconds: number): void;
  }
}
