import React from "react";
import { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "@auth0/nextjs-auth0";
import { useApollo } from "../lib/apolloClient";

import "../styles/globals.css";

const App = ({ Component, pageProps, ...rest }: AppProps) => {
  const apolloClient = useApollo(pageProps?.initialApolloState, {
    Component,
    pageProps,
    ...rest
  });
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

export const initialProps = async ({ ctx, Component }) => {
  if (Component.getServerSideProps) {
    Object.assign({}, await Component.getServerSideProps(ctx));
  }
  return {};
};

AuthApp.getInitialProps = initialProps;

export default appWithTranslation(AuthApp);
