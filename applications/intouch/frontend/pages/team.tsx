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
import can from "../lib/permissions/can";
import { Layout } from "../components/Layout";
import { GlobalPageProps, withPage } from "../lib/middleware/withPage";
import { sortByFirstName } from "../lib/utils/account";
import CompanyMembers, { PageProps } from "../components/Pages/Company/Members";
import { getServerPageTeamMembers } from "../graphql/generated/page";

export const pageQuery = gql`
  query teamMembers($expiryDate: Datetime, $marketId: Int) {
    accounts(condition: { marketId: $marketId }) {
      totalCount
      nodes {
        id
        role
        email
        phone
        photo
        signedPhotoUrl
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
        projectMembers {
          nodes {
            project {
              id
              technology
              name
              startDate
              endDate
              hidden
            }
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
  async ({ apolloClient, locale, account, globalPageData, market, res }) => {
    const expiryDate = new Date();
    expiryDate.setHours(0, 0, 0, 0);
    expiryDate.setMonth(expiryDate.getMonth() - 6);

    const translations = await serverSideTranslations(locale, [
      "common",
      "sidebar",
      "team-page",
      "error-page"
    ]);

    const { props } = await getServerPageTeamMembers(
      {
        variables: {
          expiryDate,
          marketId: market.id
        }
      },
      apolloClient
    );

    if (!can(account, "page", "team")) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(
        statusCode,
        {},
        { globalPageData, ...translations }
      );
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
        ...translations
      }
    };
  }
);

export default withPageAuthRequired(withPageError<PageProps>(TeamPage));
