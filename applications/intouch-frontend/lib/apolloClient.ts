import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const { NEXT_PUBLIC_APOLLO_CLIENT_URL } = process.env;

const getClient = (token: string) => {
  const authLink = setContext(async (_, { headers }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${token}`
    }
  }));

  const httpLink = new HttpLink({
    uri: NEXT_PUBLIC_APOLLO_CLIENT_URL
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
};

export default (token: string) => getClient(token);
