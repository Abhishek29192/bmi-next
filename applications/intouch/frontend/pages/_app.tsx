import React from "react";
import Router from "next/router";
import { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "@auth0/nextjs-auth0";
import { useApollo } from "../lib/apolloClient";
import auth0 from "../lib/auth0";
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

AuthApp.getInitialProps = async ({ ctx, Component }) => {
  const { req, res, pathname } = ctx;

  // Lets api work normally
  if (pathname.indexOf("/api") !== -1) {
    return {};
  }

  // Check if the user is a company_admin and if he has a company
  const session = await auth0.getSession(req, res);

  if (session) {
    ctx.session = session;
    const { user } = session;
    const regCompleted = user[`${process.env.AUTH0_NAMESPACE}/reg_to_complete`];
    if (pathname !== "/company-registration" && regCompleted) {
      if (res) {
        res.writeHead(302, { Location: "/company-registration" });
        res.end();
      } else {
        Router.replace("/company-registration");
      }
      return {};
    }
  }

  if (Component.getServerSideProps) {
    Object.assign({}, await Component.getServerSideProps(ctx));
  }

  return {};
};

export default appWithTranslation(AuthApp);
