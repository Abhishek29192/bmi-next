import React from "react";
import ProfileCard from "@bmi/profile-card";
import Button from "@bmi/button";
import Table from "@bmi/table";
import { Account } from "@bmi/intouch-api-types";
import Dialog from "@bmi/dialog";
import TextField from "@bmi/text-field";
import Typography from "@bmi/typography";
import { Email, Phone, Edit } from "@material-ui/icons";
import Avatar from "@material-ui/core/Avatar";
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
  const { t } = useTranslation("profile");
  const [open, setOpen] = React.useState(false);

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
                title={t(`profileCard.role.${account.role}`)}
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
              <Button
                variant="link"
                startIcon={<Edit />}
                onClick={() => setOpen(true)}
              >
                {t("profileCard.buttons.editProfile")}
              </Button>
              <Dialog
                open={open}
                onCloseClick={() => setOpen(false)}
                backdropProps={{
                  className: "test-backdrop"
                }}
                className={UserProfile.modal}
              >
                <Dialog.Title hasUnderline>{t("editModal.title")}</Dialog.Title>
                <Dialog.Content className={UserProfile.modalContent}>
                  <EditUserForm account={account} />
                  <Dialog.Actions
                    className={UserProfile.modalClose}
                    confirmLabel={t("editModal.buttons.saveAndClose")}
                    onConfirmClick={() => setOpen(false)}
                  />
                </Dialog.Content>
              </Dialog>
              <Button>{t("profileCard.buttons.changePassword")}</Button>
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
          "profile",
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
