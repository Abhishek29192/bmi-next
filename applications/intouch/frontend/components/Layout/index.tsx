import { gql } from "@apollo/client";
import { BMI, Icon, ThemeProvider } from "@bmi-digital/components";
import Head from "next/head";
import React from "react";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";
import { Footer, Props as FooterProps } from "../Footer";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import LogoutPopup from "./LogoutPopup";
import styles from "./styles.module.scss";

export type LayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  title: string;
  pageData?: GetGlobalDataQuery;
};

export const GET_PAGE_DATA = gql`
  query GetGlobalData($accountId: Int!, $tag: String!) {
    # Only one Market Content is expected to be available for user
    marketContentCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
      limit: 1
    ) {
      items {
        footerLinksCollection {
          items {
            title
            relativePath
          }
        }
        # Top bar - Contact us link
        contactUsPage {
          title
          relativePath
        }
        # Top bar - global external link
        externalLinkUrl
        externalLinkLabel
      }
    }
    notifications(last: 125, condition: { accountId: $accountId }) {
      nodes {
        body
        sendDate
        read
        id
      }
    }
  }
`;

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
  const marketContent = pageData?.marketContentCollection?.items[0];
  const notifications = pageData?.notifications?.nodes;

  return (
    <ThemeProvider>
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
            <Header
              title={title}
              contactUsLink={
                marketContent?.contactUsPage && {
                  href: marketContent.contactUsPage.relativePath,
                  label: marketContent.contactUsPage.title
                }
              }
              globalExternalLink={
                marketContent && {
                  href: marketContent.externalLinkUrl,
                  label: marketContent.externalLinkLabel,
                  isExternal: true
                }
              }
              notifications={notifications}
            />
            <div className={styles.appContent}>{children}</div>
            <Footer links={footerLinks} />
            <LogoutPopup showAfter={1000 * 60 * 19} waitFor={60 * 1000} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};
