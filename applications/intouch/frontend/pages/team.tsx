import React from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  ErrorStatusCode,
  generatePageError,
  withPageError
} from "../lib/error";
import { Layout } from "../components/Layout";
import { withPage } from "../lib/middleware/withPage";
import CompanyMembers, { PageProps } from "../components/Pages/Company/Members";
import { getServerPageCompanyMembers } from "../graphql/generated/page";

export const pageQuery = gql`
  query companyMembers($expiryDate: Datetime) {
    companyMembers {
      nodes {
        id
        company {
          name
        }
        account {
          id
          role
          email
          phone
          photo
          lastName
          firstName
          formattedRole
          certificationsByDoceboUserId(
            filter: { expiryDate: { greaterThanOrEqualTo: $expiryDate } }
          ) {
            nodes {
              id
              name
              technology
              expiryDate
            }
          }
        }
      }
    }
  }
`;

export const mutationUpdateAccount = gql`
  mutation UpdateRoleAccount($input: UpdateAccountInput!) {
    updateAccount(input: $input) {
      account {
        id
      }
    }
  }
`;

export const reorderMembers = (nodes) =>
  [...nodes].sort((a, b) =>
    a.account?.firstName?.localeCompare(b?.account?.firstName)
  );

const TeamPage = (props: PageProps) => {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("Team")}>
      <CompanyMembers {...props} />
    </Layout>
  );
};

export const getServerSideProps = withPage(
  async ({ apolloClient, locale, account, res }) => {
    const expiryDate = new Date();
    expiryDate.setHours(0, 0, 0, 0);
    expiryDate.setMonth(expiryDate.getMonth() - 6);

    const { props } = await getServerPageCompanyMembers(
      {
        variables: {
          expiryDate
        }
      },
      apolloClient
    );

    if (account?.companyMembers?.nodes.length === 0) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(404);
    }

    return {
      props: {
        ...props,
        data: {
          ...props.data,
          companyMembers: {
            ...props.data.companyMembers,
            nodes: reorderMembers(props.data.companyMembers.nodes)
          }
        },
        ...(await serverSideTranslations(locale, [
          "common",
          "sidebar",
          "team-page"
        ])),
        account
      }
    };
  }
);

export default withPageAuthRequired(withPageError<PageProps>(TeamPage));
