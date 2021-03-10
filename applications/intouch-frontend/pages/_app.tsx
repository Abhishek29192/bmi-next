import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { ApolloProvider } from "@apollo/client";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import apolloClient from "../lib/apolloClient";

import "../styles/globals.css";

const {
  NEXT_PUBLIC_AUTH_DOMAIN,
  NEXT_PUBLIC_AUTH_CLIENTID,
  NEXT_PUBLIC_AUTH_REDIRECTURI,
  NEXT_PUBLIC_AUTH_AUDIENCE
} = process.env;

const App = ({ Component, pageProps }: AppProps) => {
  const [token, setToken] = useState<string>();
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect,
    getAccessTokenSilently
  } = useAuth0();

  useEffect(() => {
    const getToken = async () => {
      const bearerToken = isAuthenticated ? await getAccessTokenSilently() : "";
      setToken(bearerToken);
    };

    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (!isAuthenticated) {
    return <button onClick={() => loginWithRedirect()}>Login</button>;
  }

  return (
    token && (
      <ApolloProvider client={apolloClient(token)}>
        <Component {...pageProps} />
      </ApolloProvider>
    )
  );
};

const AuthWrapper = ({ Component, pageProps, ...rest }: AppProps) => (
  <Auth0Provider
    domain={NEXT_PUBLIC_AUTH_DOMAIN}
    clientId={NEXT_PUBLIC_AUTH_CLIENTID}
    redirectUri={NEXT_PUBLIC_AUTH_REDIRECTURI}
    audience={NEXT_PUBLIC_AUTH_AUDIENCE}
  >
    <App Component={Component} pageProps={pageProps} {...rest} />
  </Auth0Provider>
);

export default appWithTranslation(AuthWrapper);
