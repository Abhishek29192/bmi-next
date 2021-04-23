import { useMemo } from "react";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { ApolloLink } from "@apollo/client/link/core";
import { setContext } from "@apollo/client/link/context";

import auth0 from "./auth0";

let apolloClient;
const { NEXT_PUBLIC_BASE_URL } = process.env;

const createApolloClient = async (
  ctx
): Promise<ApolloClient<NormalizedCacheObject>> => {
  const isBrowser = typeof window !== "undefined";

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        // eslint-disable-next-line no-console
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    // eslint-disable-next-line no-console
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  let accessToken;
  if (ctx) {
    const session = await auth0.getSession(ctx.req, ctx.res);
    accessToken = `Bearer ${session.accessToken}`;
  }

  const httpLink = new HttpLink({
    uri: `${NEXT_PUBLIC_BASE_URL}/api/graphql`,
    credentials: "same-origin"
  });

  const authLink = setContext((req, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: accessToken || ""
      }
    };
  });

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    credentials: "include",
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  });
};

export const initializeApollo = (
  initialState = null,
  ctx
): ApolloClient<NormalizedCacheObject> => {
  const _apolloClient = apolloClient ?? createApolloClient(ctx);

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
};

export const useApollo = (initialState, ctx = null) => {
  const store = useMemo(() => initializeApollo(initialState, ctx), [
    initialState,
    ctx
  ]);
  return store;
};
