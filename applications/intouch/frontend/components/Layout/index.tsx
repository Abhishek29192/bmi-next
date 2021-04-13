import React from "react";
import Head from "next/head";
import Icon from "@bmi/icon";
import BmiThemeProvider from "@bmi/theme-provider";
import { BMI } from "@bmi/logo";
import { Sidebar } from "../Sidebar";
import { Header } from "../Header";
import { Footer } from "../Footer";
import styles from "./styles.module.scss";

export type LayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  title: string;
};

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <BmiThemeProvider>
      <div>
        <Head>
          <title>BMI InTouch</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div className={styles.appContainer}>
          <div className={styles.sidebar}>
            <div className={styles.logoContainer}>
              <Icon
                source={BMI}
                className={styles.logo}
                style={{ width: 72, display: "block" }}
              />
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
};
