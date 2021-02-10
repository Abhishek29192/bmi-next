import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const { NEXT_PUBLIC_APOLLO_CLIENT_URL } = process.env;
const apolloCLient = new ApolloClient({
  link: new HttpLink({
    uri: NEXT_PUBLIC_APOLLO_CLIENT_URL
  }),
  cache: new InMemoryCache()
});

export default apolloCLient;
