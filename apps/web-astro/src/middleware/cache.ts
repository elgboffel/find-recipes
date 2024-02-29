import { defineMiddleware } from "astro:middleware";

type Path = string;
interface ICachedResponse {
  response: Response;
  expires: number;
}

const store = new Map<Path, ICachedResponse>();

export const memoryCache = defineMiddleware(async (req, next) => {
  let ttl: number | undefined;

  if (!req.locals.runtime?.env) return await next();

  const { KV } = req.locals.runtime.env;
  await KV.put(req.url.pathname, await req.request.arrayBuffer() ?? "");
  const test = await KV.get(req.url.pathname);
  const newRes = test ? new Response(test) : null;

  if (newRes)
    return newRes.clone();

  // Add a `cache` method to the `req.locals` object
  // that will allow us to set the cache duration for each page.
  req.locals.cache = (seconds: number = 60) => {
    ttl = seconds;
  };

  const cached = store.get(req.url.pathname);

  if (cached && cached.expires > Date.now()) {
    return cached.response.clone();
  } else if (cached) {
    store.delete(req.url.pathname);
  }

  const response = await next();

  // If the `cache` method was called, store the response in the cache.
  if (ttl !== undefined) {
    store.set(
      req.url.pathname,{
        response: response.clone(),
        expires: Date.now() + ttl * 1000,
      }
    );
  }

  return response;
});
