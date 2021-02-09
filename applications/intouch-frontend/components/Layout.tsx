import React from "react";
import Head from "next/head";
import Icon from "@bmi/icon";
import BmiThemeProvider from "@bmi/theme-provider";
import { BMI } from "@bmi/logo";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import styles from "./styles/Layout.module.scss";

interface Props {
  children: React.ReactNode | React.ReactNode[];
  title: string;
}

const Layout = ({ children, title }: Props) => (
  <BmiThemeProvider>
    <div>
      <Head>
        <title>BMI InTouch</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.appContainer}>
        <div className={styles.sidebar}>
          <div className={styles.logoContainer}>
            <Icon source={BMI} style={{ width: 72, display: "block" }} />
          </div>
          <Sidebar />
        </div>

        <div className={styles.appMain}>
          <Header title={title} />
          <div className={styles.appContent}>{children}</div>

          <Footer />
        </div>
      </div>
    </div>
  </BmiThemeProvider>
);

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"]))
  }
});

export default Layout;
