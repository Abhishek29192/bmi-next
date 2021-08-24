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
  const { contactUsPage } = globalPageData.marketContentCollection.items[0];
  return (
    <Layout
      title={[account.firstName, account.lastName].filter(Boolean).join(" ")}
      pageData={globalPageData}
    >
      <UserProfilePageContent
        accountSSR={account}
        contactUsPage={{
          href: contactUsPage.relativePath,
          label: contactUsPage.title
        }}
      />
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
    signedPhotoUrl
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
  query getUserProfile($accountId: Int!, $marketDomain: String!) {
    account(id: $accountId) {
      ...AccountPageDetailsFragment
    }
    markets(condition: { domain: $marketDomain }) {
      nodes {
        geoMiddle {
          x
          y
        }
      }
    }
  }
`;

export const getServerSideProps = withPage(
  async ({ locale, apolloClient, globalPageData, account, marketDomain }) => {
    const {
      props: {
        data: { account: pageAccount, markets }
      }
    } = await getServerPageGetUserProfile(
      { variables: { accountId: account.id, marketDomain } },
      apolloClient
    );

    return {
      props: {
        globalPageData,
        account,
        market: markets?.nodes?.[0],
        pageAccount,
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
