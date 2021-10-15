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
        logger.error(`[Network error]: ${networkError}`);
      } else {
        // eslint-disable-next-line no-console
        console.log(`[Network error]: ${networkError}`);
      }
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
    let userId;
    let accessToken;

    if (ctx.req) {
      const auth0 = await getAuth0Instance(ctx.req, ctx.res);
      const session = auth0.getSession(ctx.req, ctx.res);

      // We use apollo client also before adding the session object in the req object
      // in particular in pages/api/auth/auth0 in the afterCallback, this is why
      // we need to check ctx.session
      accessToken = `Bearer ${
        session?.accessToken || ctx.session?.accessToken
      }`;
      userId = session?.user?.sub || ctx.session?.user?.sub;
    }

    return {
      headers: {
        ...headers,
        authorization: accessToken || "",
        // Logging purpose
        ...(headers?.["x-request-id"] && {
          "x-request-id": headers?.["x-request-id"]
        }),
        // Logging purpose
        ...(headers?.["x-authenticated-user-id"] && {
          "x-authenticated-user-id": headers?.["x-authenticated-user-id"]
        })
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
