import React from "react";
import Head from "next/head";
import Typography from "@bmi/typography";
import Icon from "@bmi/icon";
import BmiThemeProvider from "@bmi/theme-provider";
import Logo from "@bmi/logo";
import { BMI, StandardPale } from "@bmi/logo";
import { Sidebar } from "./SidebarNavigation";
import styles from "./styles/Layout.module.scss";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const Layout = ({ children }: Props) => (
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
          <div className={styles.appHeader}>
            <Typography variant="h3">COMPANY NAME</Typography>
          </div>

          <div className={styles.appContent}>{children}</div>

          <div className={styles.appFooter}>
            <Icon source={BMI} style={{ width: 50 }} />
            <Logo source={StandardPale} style={{ width: 120 }} />
          </div>
        </div>
      </div>
    </div>
  </BmiThemeProvider>
);

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "sidebar"]))
  }
});

export default Layout;
