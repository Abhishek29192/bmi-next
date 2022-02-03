import React from "react";
import { Session } from "@auth0/nextjs-auth0";
import { gql } from "@apollo/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Document } from "@contentful/rich-text-types";
import Typography from "@bmi/typography";
import { getAuth0Instance } from "../lib/auth0";
import { GlobalPageProps, withPage } from "../lib/middleware/withPage";
import { withPublicPage } from "../lib/middleware/withPublicPage";
import { Layout as AuthenticatedLayout } from "../components/Layout";
import { Layout as UnauthenticatedLayout } from "../components/Layout/Unauthenticated";
import { RichText } from "../components/RichText";
import {
  ErrorStatusCode,
  generatePageError,
  withPageError
} from "../lib/error";
import { getServerPageGetContentArticleContent } from "../graphql/generated/page";
import styles from "../styles/ContentArticle.module.scss";

export const GET_CONTENT_ARTICLE_CONTENT = gql`
  query getContentArticleContent($relativePath: String!) {
    contentArticleCollection(where: { relativePath: $relativePath }, limit: 1) {
      items {
        title
        body {
          json
        }
      }
    }
  }
`;

type ContentArticlePageProps = GlobalPageProps & {
  title: string;
  body: Document;
};

const ContentArticlePage = ({
  account,
  title,
  body,
  globalPageData
}: ContentArticlePageProps) => {
  // If we have an account we must have come from authenticated middlreware
  if (account) {
    return (
      <AuthenticatedLayout title={title} pageData={globalPageData}>
        <div className={styles.container}>
          <RichText content={body} />
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <UnauthenticatedLayout title={title}>
      <Typography component="h1" variant="h1" style={{ marginBottom: "0.6em" }}>
        {title}
      </Typography>
      <RichText content={body} />
    </UnauthenticatedLayout>
  );
};

// Only these paths will be served without requiring user authentication.
// These should match `ContentArticle.relativePath` in contentful, without the leading `/`.
// Note that these have to include all paths across markets. This is a workaround.
// They just happen to have been made the same across markets at the time of writing this.
const PUBLIC_PAGE_PATHS = ["privacy", "terms", "cookies"];

export const getServerSideProps = async (context) => {
  const { contentArticleRelativePath } = context.params;

  // Only if we're requesting for a public page AND we're not logged in (no session) can we use the public middleware.
  // otherwise use authenticated middleware.
  const auth0 = await getAuth0Instance(context.req, context.res);
  const session: Session = auth0.getSession(context.req, context.res);
  const middleware =
    PUBLIC_PAGE_PATHS.includes(contentArticleRelativePath) && !session
      ? withPublicPage
      : withPage;

  // account and globalPageData are only available in withPage middleware
  return await middleware(
    async ({ globalPageData, locale, apolloClient, res }) => {
      const translations = await serverSideTranslations(locale, [
        "common",
        "sidebar",
        "error-page"
      ]);

      const {
        props: {
          data: {
            contentArticleCollection: {
              items: [pageContent]
            }
          }
        }
      } = await getServerPageGetContentArticleContent(
        {
          variables: {
            relativePath: `/${contentArticleRelativePath}`
          }
        },
        apolloClient
      );

      if (!pageContent) {
        const statusCode = ErrorStatusCode.NOT_FOUND;
        res.statusCode = statusCode;
        return generatePageError(
          statusCode,
          {},
          {
            globalPageData,
            ...translations
          }
        );
      }

      return {
        props: {
          title: pageContent.title,
          body: pageContent.body.json,
          ...translations
        }
      };
    }
  )(context);
};

export default withPageError<ContentArticlePageProps>(ContentArticlePage);
