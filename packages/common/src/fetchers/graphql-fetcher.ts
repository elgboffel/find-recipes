import { GraphQLFetcher, GraphQLResponse } from "./types";
import { stripIgnoredCharacters } from "graphql/utilities";
import { fetcher } from "./fetcher";
import { Error } from "../errors/app-error/error";

export async function graphqlFetcher<TResponse>({
  url,
  query,
  variables,
  config,
}: GraphQLFetcher): Promise<GraphQLResponse<TResponse> | Error> {
  return await fetcher<GraphQLResponse<TResponse>>({
    url,
    config: {
      method: "POST",
      body: JSON.stringify({
        query: stripIgnoredCharacters(query),
        variables,
      }),
      ...config,
      headers: {
        ...(config?.headers ? { ...config.headers } : {}),
      },
    },
  });
}
