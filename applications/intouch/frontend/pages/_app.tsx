import React from "react";
import { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "@auth0/nextjs-auth0";
import { useApollo } from "../lib/apolloClient";

import initialProps from "../lib/initialProps/app";
import useApi from "../hooks/useApi";

import "../styles/globals.css";

const App = ({ Component, pageProps, ...rest }: AppProps) => {
  const apolloClient = useApollo(pageProps?.initialApolloState);

  const { error } = useApi("/profile");
  if (error?.status === 401) {
    window.location.assign(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} apolloClient={apolloClient} {...rest} />
    </ApolloProvider>
  );
};

const AuthApp = ({ Component, pageProps, ...rest }: AppProps) => {
  return (
    <UserProvider>
      <App Component={Component} pageProps={pageProps} {...rest} />
    </UserProvider>
  );
};

AuthApp.getInitialProps = initialProps;

export default appWithTranslation(AuthApp);
