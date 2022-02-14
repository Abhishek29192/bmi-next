import React from "react";
import BmiThemeProvider from "@bmi-digital/components/theme-provider";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getServerPageGetCompany } from "../graphql/generated/page";
import { GetCompanyQuery } from "../graphql/generated/operations";
import { findAccountCompany } from "../lib/account";
import { GlobalPageProps, withPage } from "../lib/middleware/withPage";
import { EditCompanyDialog } from "../components/Pages/Company/EditCompany/Dialog";

type Props = GlobalPageProps & {
  company: GetCompanyQuery["company"];
  mapsApiKey: string;
};

const CompanyRegistrationPage = ({ company, mapsApiKey }: Props) => {
  // The company is created when we create the user in the db
  // through an sql procedure (create_account) here we just
  // need to update it with the new values
  return (
    <BmiThemeProvider>
      <EditCompanyDialog
        company={company}
        isOpen
        mapsApiKey={mapsApiKey}
        onCompanyUpdateSuccess={() => {
          // Redirect to silent-login in order to re-create the session as we need to remove
          // the claim from the jwt token to stop showing the registration page to the user
          window.location.assign("/api/silent-login?returnTo=/");
        }}
      />
    </BmiThemeProvider>
  );
};

export const getServerSideProps = withPage(
  async ({ apolloClient, locale, account }) => {
    const companyId = findAccountCompany(account)?.id;

    if (!companyId) {
      return {
        redirect: {
          permanent: false,
          destination: "/"
        }
      };
    }
    const {
      props: {
        data: { company }
      }
    } = await getServerPageGetCompany(
      { variables: { companyId } },
      apolloClient
    );

    if (company.status !== "NEW") {
      return {
        redirect: {
          permanent: false,
          destination: `/companies/${companyId}`
        }
      };
    }
    return {
      props: {
        company,
        mapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        ...(await serverSideTranslations(locale, ["common", "company-page"]))
      }
    };
  }
);

export default withPageAuthRequired(CompanyRegistrationPage);
