import React from "react";
import { gql } from "@apollo/client";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "../components/Layout/Unauthenticated";
import { RichText } from "../components/RichText";
import { withPublicPage } from "../lib/middleware/withPublicPage";
import { getServerPagePrivacy } from "../graphql/generated/page";
import { getSecret } from "../lib/utils/secrets";

export const CONTENT = gql`
  query PrivacyPage {
    contentArticleCollection(where: { relativePath_in: ["/privacy"] }) {
      items {
        title
        body {
          json
        }
      }
    }
  }
`;

const Privacy = ({ data }: any) => {
  const { t } = useTranslation();

  return (
    <Layout title={t("title")}>
      <div style={{ width: "80%", margin: "15px auto" }}>
        <Typography component="h1" variant="h1" style={{ marginBottom: 30 }}>
          {data?.title}
        </Typography>
        <RichText content={data?.body?.json} />
      </div>
    </Layout>
  );
};

export const getServerSideProps = withPublicPage(
  async ({ locale, apolloClient }) => {
    const GATEWAY_API_KEY = await getSecret(
      process.env.GCP_SECRET_PROJECT,
      "GATEWAY_API_KEY"
    );

    const { props } = await getServerPagePrivacy(
      {
        context: {
          headers: {
            "x-api-key": GATEWAY_API_KEY
          }
        }
      },
      apolloClient
    );

    return {
      props: {
        data: props.data.contentArticleCollection.items[0],
        ...(await serverSideTranslations(locale, ["common"]))
      }
    };
  }
);

export default Privacy;
