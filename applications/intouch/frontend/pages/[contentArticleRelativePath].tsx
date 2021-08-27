import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { gql } from "@apollo/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Document } from "@contentful/rich-text-types";
import { GlobalPageProps, withPage } from "../lib/middleware/withPage";
import { Layout } from "../components/Layout";
import { RichText } from "../components/RichText";
import {
  ErrorStatusCode,
  generatePageError,
  withPageError
} from "../lib/error";
import { GetGlobalDataQuery } from "../graphql/generated/operations";
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
  title,
  body,
  globalPageData
}: ContentArticlePageProps) => {
  return (
    <Layout title={title} pageData={globalPageData}>
      <div className={styles.container}>
        <RichText content={body} />
      </div>
    </Layout>
  );
};

export const getServerSideProps = withPage(
  async ({ locale, apolloClient, globalPageData, res, params }) => {
    const { contentArticleRelativePath } = params;

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
          globalPageData
        }
      );
    }

    return {
      props: {
        title: pageContent.title,
        body: pageContent.body.json,
        ...(await serverSideTranslations(locale, ["common"]))
      }
    };
  }
);

export default withPageAuthRequired(
  withPageError<ContentArticlePageProps>(ContentArticlePage)
);
