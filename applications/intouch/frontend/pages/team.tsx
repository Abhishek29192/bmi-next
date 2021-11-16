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
import { GlobalPageProps, withPage } from "../lib/middleware/withPage";
import { sortByFirstName } from "../lib/utils/account";
import CompanyMembers, { PageProps } from "../components/Pages/Company/Members";
import { getServerPageTeamMembers } from "../graphql/generated/page";
import { isSuperOrMarketAdmin } from "../lib/account";

export const pageQuery = gql`
  query teamMembers($expiryDate: Datetime) {
    accounts {
      totalCount
      nodes {
        id
        role
        email
        phone
        photo
        lastName
        firstName
        formattedRole
        status
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
        companyMembers(first: 1) {
          nodes {
            id
            company {
              name
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

type TeamPageProps = PageProps & GlobalPageProps;

const TeamPage = ({ globalPageData, ...props }: TeamPageProps) => {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("Team")} pageData={globalPageData}>
      <CompanyMembers {...props} />
    </Layout>
  );
};

export const getServerSideProps = withPage(
  async ({ apolloClient, locale, account, res }) => {
    const expiryDate = new Date();
    expiryDate.setHours(0, 0, 0, 0);
    expiryDate.setMonth(expiryDate.getMonth() - 6);

    const { props } = await getServerPageTeamMembers(
      {
        variables: {
          expiryDate
        }
      },
      apolloClient
    );

    if (
      !isSuperOrMarketAdmin(account) &&
      account?.companyMembers?.nodes.length === 0
    ) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(404);
    }

    return {
      props: {
        ...props,
        data: {
          ...props.data,
          accounts: {
            ...props.data.accounts,
            nodes: sortByFirstName(props.data.accounts.nodes)
          }
        },
        ...(await serverSideTranslations(locale, [
          "common",
          "sidebar",
          "team-page"
        ]))
      }
    };
  }
);

export default withPageAuthRequired(withPageError<PageProps>(TeamPage));
