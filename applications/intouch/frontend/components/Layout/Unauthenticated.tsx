import React from "react";
import Head from "next/head";
import Icon from "@bmi/icon";
import BmiThemeProvider from "@bmi/theme-provider";
import { BMI } from "@bmi/logo";
import { Footer, Props as FooterProps } from "../Footer";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";
import styles from "./styles.module.scss";

export type LayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  title: string;
  pageData?: GetGlobalDataQuery;
};

const mapFooterLinks = (pageData: GetGlobalDataQuery): FooterProps["links"] => {
  return pageData.marketContentCollection?.items[0]?.footerLinksCollection.items.map(
    ({ title, relativePath }) => {
      return {
        label: title,
        href: relativePath
      };
    }
  );
};

export const Layout = ({ children, title, pageData = {} }: LayoutProps) => {
  const footerLinks = pageData ? mapFooterLinks(pageData) : [];

  return (
    <BmiThemeProvider>
      <div>
        <Head>
          <title>BMI InTouch - {title}</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div className={styles.appContainerPublic}>
          <div className={styles.appMainPublic}>
            <div className={styles.logoContainerPublic}>
              <Icon source={BMI} className={styles.logo} />
            </div>
            <div className={styles.appContentPublic}>{children}</div>
            <Footer links={footerLinks} />
          </div>
        </div>
      </div>
    </BmiThemeProvider>
  );
};
