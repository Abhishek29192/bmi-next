import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { gql } from "@apollo/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withPageError } from "../lib/error";
import { GetUserProfileQuery } from "../graphql/generated/operations";
import { getServerPageGetUserProfile } from "../graphql/generated/page";
import { GlobalPageProps, withPage } from "../lib/middleware/withPage";
import { Layout } from "../components/Layout";
import { UserProfilePageContent } from "../components/Pages/UserProfile";

type UserProfilePageProps = GlobalPageProps & {
  pageAccount: GetUserProfileQuery["account"];
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
  query getUserProfile($accountId: Int!) {
    account(id: $accountId) {
      ...AccountPageDetailsFragment
    }
  }
`;

export const getServerSideProps = withPage(
  async ({ locale, apolloClient, account }) => {
    const {
      props: {
        data: { account: pageAccount }
      }
    } = await getServerPageGetUserProfile(
      { variables: { accountId: account.id } },
      apolloClient
    );

    return {
      props: {
        // called "pageAccount" so that it doesn't override "account", which is passed via "withPage"
        // the "account" property is needed for the context
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
