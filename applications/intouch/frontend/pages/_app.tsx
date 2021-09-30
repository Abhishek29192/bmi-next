import React from "react";
import { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "@auth0/nextjs-auth0";
import { StylesProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";
import { useApollo } from "../lib/apolloClient";
import AccountContextWrapper from "../context/AccountContext";
import MarketContextWrapper from "../context/MarketContext";
import "../styles/globals.css";

const App = ({ Component, pageProps, ...rest }: AppProps) => {
  const apolloClient = useApollo(pageProps?.initialApolloState, {
    Component,
    pageProps,
    ...rest
  });

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <StylesProvider injectFirst>
        <CssBaseline />
        <Component {...pageProps} apolloClient={apolloClient} {...rest} />
      </StylesProvider>
    </ApolloProvider>
  );
};

const AuthApp = ({ Component, pageProps, ...rest }: AppProps) => {
  return (
    <UserProvider>
      <MarketContextWrapper market={pageProps.market}>
        <AccountContextWrapper account={pageProps.account}>
          <App Component={Component} pageProps={pageProps} {...rest} />
        </AccountContextWrapper>
      </MarketContextWrapper>
    </UserProvider>
  );
};

AuthApp.getInitialProps = async (appContext) => {
  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = {
      ...pageProps,
      ...(await appContext.Component.getInitialProps(appContext))
    };
  }

  if (appContext.Component.getServerSideProps) {
    pageProps = {
      ...pageProps,
      ...(await appContext.Component.getServerSideProps(appContext))
    };
  }

  return {
    pageProps
  };
};

export default appWithTranslation(AuthApp);
