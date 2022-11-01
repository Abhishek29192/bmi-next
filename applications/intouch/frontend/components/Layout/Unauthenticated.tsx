import { BMI, Icon, ThemeProvider } from "@bmi-digital/components";
import classnames from "classnames";
import Head from "next/head";
import React from "react";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";
import { Footer, Props as FooterProps } from "../Footer";
import styles from "./styles.module.scss";

export type LayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  pageData?: GetGlobalDataQuery;
  isError?: boolean;
  title: string;
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

export const Layout = ({
  children,
  title,
  pageData = {},
  isError
}: LayoutProps) => {
  const footerLinks = pageData ? mapFooterLinks(pageData) : [];

  return (
    <ThemeProvider>
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
            <div
              className={
                isError
                  ? classnames(styles.appContentPublic, styles.appError)
                  : styles.appContentPublic
              }
            >
              {children}
            </div>
            <Footer links={footerLinks} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};
