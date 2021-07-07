import React from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout } from "../components/Layout";
import { withPage } from "../lib/middleware/withPage";
import CompanyMembers, { PageProps } from "../components/Pages/CompanyMembers";
import { getServerPageCompanyMembers } from "../graphql/generated/page";
import { CompanyMembersQuery } from "../graphql/generated/operations";

export const pageQuery = gql`
  query companyMembers {
    companyMembers {
      nodes {
        id
        account {
          id
          email
          firstName
          lastName
          role
          certificationsByDoceboUserId {
            nodes {
              technology
            }
          }
        }
      }
    }
  }
`;

const TeamPage = (props: PageProps) => {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("Team")}>
      <CompanyMembers {...props} />
    </Layout>
  );
};

export const getServerSideProps = withPage(async ({ apolloClient, locale }) => {
  const { props } = await getServerPageCompanyMembers({}, apolloClient);

  const nodes = [...props.data.companyMembers.nodes].sort((a, b) =>
    a.account.firstName.localeCompare(b.account.firstName)
  );

  return {
    props: {
      ...props,
      data: {
        ...props.data,
        companyMembers: {
          ...props.data.companyMembers,
          nodes
        }
      },
      ...(await serverSideTranslations(locale, ["common"]))
    }
  };
});

export default withPageAuthRequired(TeamPage);
