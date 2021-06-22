import { useMemo } from "react";
import { v4 } from "uuid";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { ApolloLink } from "@apollo/client/link/core";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { getAuth0Instance } from "../lib/auth0";

let apolloClient;
const createApolloClient = (ctx): ApolloClient<NormalizedCacheObject> => {
  let baseUrl;
  const isBrowser = typeof window !== "undefined";

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) => {
        // eslint-disable-next-line no-console
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    if (networkError) {
      // eslint-disable-next-line no-console
      console.log(`[Network error]: ${networkError}`);
    }
  });

  if (!isBrowser) {
    const protocol = ctx?.req?.headers["x-forwarded-proto"] || "http";
    baseUrl = `${protocol}://${ctx?.req?.headers?.host}`;
  } else {
    baseUrl = `${window.location.protocol}//${window.location.host}`;
  }

  const uploadLink = createUploadLink({
    uri: `${baseUrl}/api/graphql`
  });

  const authLink = setContext(async (req, { headers }) => {
    let accessToken;

    if (ctx.req) {
      const auth0 = await getAuth0Instance(ctx.req, ctx.res);
      const session = auth0.getSession(ctx.req, ctx.res);
      accessToken = `Bearer ${
        session?.accessToken || ctx.session?.accessToken
      }`;
    }

    return {
      headers: {
        ...headers,
        authorization: accessToken || "",
        "x-request-id": v4()
      }
    };
  });

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
