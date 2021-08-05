import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { gql } from "@apollo/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withPageError } from "../lib/error";
import {
  GetUserProfileQuery,
  GetGlobalDataQuery
} from "../graphql/generated/operations";
import { getServerPageGetUserProfile } from "../graphql/generated/page";
import { withPage } from "../lib/middleware/withPage";
import { Layout } from "../components/Layout";
import { UserProfilePageContent } from "../components/Pages/UserProfile";

type UserProfilePageProps = {
  pageAccount: GetUserProfileQuery["account"];
  globalPageData: GetGlobalDataQuery;
};

const UserProfilePage = ({
  pageAccount,
  globalPageData
}: UserProfilePageProps) => {
  const account = pageAccount;
  return (
    <Layout
      title={[account.firstName, account.lastName].filter(Boolean).join(" ")}
      pageData={globalPageData}
    >
      <UserProfilePageContent account={account} />
    </Layout>
  );
};

export const ACCOUNT_PAGE_DETAILS_FRAGMENT = gql`
  fragment AccountPageDetailsFragment on Account {
    id
    firstName
    lastName
    role
    email
    phone
    photo
    companyMembers {
      nodes {
        company {
          id
          ...CompanyDetailsFragment
        }
      }
    }
    certificationsByDoceboUserId {
      nodes {
        id
        technology
        expiryDate
        name
      }
    }
  }
`;

export const GET_USER_CONTENT = gql`
  query getUserProfile($accountId: Int!) {
    account(id: $accountId) {
      ...AccountPageDetailsFragment
    }
  }
`;

export const getServerSideProps = withPage(
  async ({ locale, apolloClient, globalPageData, account, res }) => {
    const {
      props: { data }
    } = await getServerPageGetUserProfile(
      { variables: { accountId: account.id } },
      apolloClient
    );
    return {
      props: {
        globalPageData,
        account,
        pageAccount: data.account,
        ...(await serverSideTranslations(locale, [
          "profile",
          "company-page",
          "common",
          "sidebar",
          "footer"
        ]))
      }
    };
  }
);

export default withPageAuthRequired(
  withPageError<UserProfilePageProps>(UserProfilePage)
);
