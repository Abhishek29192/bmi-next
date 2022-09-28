import { useMemo } from "react";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { ApolloLink } from "@apollo/client/link/core";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";

let apolloClient;
const getErrorLink = (ctx) =>
  onError(({ graphQLErrors, networkError }) => {
    const logger = ctx?.req?.logger("apollo");
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) => {
        if (logger) {
          logger.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
        } else {
          // eslint-disable-next-line no-console
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
        }
      });
    if (networkError) {
      if (logger) {
        logger.error(`[Network error]: ${networkError.message}`);
      } else {
        // eslint-disable-next-line no-console
        console.log(`[Network error]: ${networkError.message}`);
      }
    }
  });

const getBaseUrl = (req) => {
  const isBrowser = typeof window !== "undefined";
  if (!isBrowser) {
    const protocol = req?.headers["x-forwarded-proto"] || "http";
    return `${protocol}://${req?.headers?.host}`;
  } else {
    return `${window.location.protocol}//${window.location.host}`;
  }
};

export const createApolloClient = (
  ctx
): ApolloClient<NormalizedCacheObject> => {
  const { req, accessToken } = ctx;
  const baseUrl = getBaseUrl(req);
  const isBrowser = typeof window !== "undefined";

  const uploadLink = createUploadLink({
    uri: `${baseUrl}/api/graphql`
  });

  const authLink = setContext(async (req, { headers }) => ({
    headers: {
      ...headers,
      ...((headers?.authorization || accessToken) && {
        authorization: `Bearer ${headers?.authorization || accessToken}`
      }),
      // Logging purpose
      ...(headers?.["x-request-id"] && {
        "x-request-id": headers?.["x-request-id"]
      }),
      // Logging purpose
      ...(headers?.["x-authenticated-user-id"] && {
        "x-authenticated-user-id": headers?.["x-authenticated-user-id"]
      }),
      ...(ctx.headers || {})
    }
  }));

  const errorLink = getErrorLink(ctx);

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: ApolloLink.from([errorLink, authLink, uploadLink]),
    cache: new InMemoryCache(),
    credentials: "include"
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
  const store = useMemo(
    () => initializeApollo(initialState, ctx),
    [initialState, ctx]
  );
  return store;
};
