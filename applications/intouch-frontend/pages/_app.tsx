import React from "react";
import { AppProps } from "next/app";
import Layout from "../components/Layout";
import { appWithTranslation } from "next-i18next";

import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Layout>
    <Component {...pageProps} />
  </Layout>
);

export default appWithTranslation(MyApp);
