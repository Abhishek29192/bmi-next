import React from "react";
import ProfileCard from "@bmi/profile-card";
import Button from "@bmi/button";
import Table from "@bmi/table";
import { Account } from "@bmi/intouch-api-types";
import { Email, Phone, Edit } from "@material-ui/icons";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { gql } from "@apollo/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TableContainer } from "../components/TableContainer";
import { UserCompanyDetails } from "../components/Cards/UserCompanyDetails";
import { CertificationRow } from "../components/Tables/CertificationRow";
import { withPageError } from "../lib/error";
import {
  GetUserProfileQuery,
  GetGlobalDataQuery
} from "../graphql/generated/operations";
import { getServerPageGetUserProfile } from "../graphql/generated/page";
import { withPage } from "../lib/middleware/withPage";
import { findAccountCompany } from "../lib/account";
import { Layout } from "../components/Layout";
import UserProfile from "../styles/UserProfile.module.scss";

export const GET_USER_CONTENT = gql`
  query getUserProfile($accountId: Int!) {
    account(id: $accountId) {
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
            name
            phone
            website
            aboutUs
            registeredAddress {
              firstLine
              secondLine
              town
              region
              country
              postcode
            }
            logo
            taxNumber
            tier
            businessType
            ownerFullname
            ownerEmail
            ownerPhone
            phone
            publicEmail
            website
            linkedIn
            facebook
            referenceNumber
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
  }
`;

const UserCertifications = ({
  certifications
}: {
  certifications: GetUserProfileQuery["account"]["certificationsByDoceboUserId"]["nodes"];
}) => {
  const { t } = useTranslation("common");
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{t("Type")}</Table.Cell>
          <Table.Cell>{t("Certification")}</Table.Cell>
          <Table.Cell>{t("Expiry")}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {certifications.map((certification) => (
          <CertificationRow
            key={certification.id}
            certification={certification}
          />
        ))}
      </Table.Body>
    </Table>
  );
};

type UserProfilePageProps = {
  pageAccount: GetUserProfileQuery["account"];
  globalPageData: GetGlobalDataQuery;
};

const UserProfilePage = ({
  pageAccount,
  globalPageData
}: UserProfilePageProps) => {
  const { t } = useTranslation("common");
  const account = pageAccount;

  // TODO: types don't match exactly, but this works practically
  const currentCompany = findAccountCompany(account as Account);

  return (
    <Layout
      title={[account.firstName, account.lastName].filter(Boolean).join(" ")}
      pageData={globalPageData}
    >
      <div className={UserProfile.layout}>
        <div>
          <TableContainer title={t("Qualifications")}>
            <UserCertifications
              certifications={account.certificationsByDoceboUserId.nodes}
            />
          </TableContainer>
          {currentCompany ? (
            <UserCompanyDetails company={currentCompany} />
          ) : null}
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <ProfileCard
            imageSource={account.photo}
            body={
              <ProfileCard.Body
                name={[account.firstName, account.lastName]
                  .filter(Boolean)
                  .join(" ")}
                title={t(account.role)}
              />
            }
          >
            <ProfileCard.Row icon={Phone}>{account.phone}</ProfileCard.Row>
            <ProfileCard.Row
              action={{ model: "htmlLink", href: "mailto:" + account.email }}
              icon={Email}
            >
              {account.email}
            </ProfileCard.Row>
            <div className={UserProfile.cardChildren}>
              <Button variant="link" startIcon={<Edit />}>
                {t("Edit")}
              </Button>
              <Button>{t("Change password")}</Button>
            </div>
          </ProfileCard>
        </div>
      </div>
    </Layout>
  );
};

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
          "common",
          "sidebar",
          "footer",
          "profile-page"
        ]))
      }
    };
  }
);

export default withPageAuthRequired(
  withPageError<UserProfilePageProps>(UserProfilePage)
);
