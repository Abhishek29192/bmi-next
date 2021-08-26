import React from "react";
import BmiThemeProvider from "@bmi/theme-provider";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getServerPageGetCompany } from "../graphql/generated/page";
import {
  GetCompanyQuery,
  GetMarketsByDomainQuery
} from "../graphql/generated/operations";
import { findAccountCompany } from "../lib/account";
import { withPage } from "../lib/middleware/withPage";
import { EditCompanyDialog } from "../components/Pages/Company/EditCompany/Dialog";

type Props = {
  company: GetCompanyQuery["company"];
  market: GetMarketsByDomainQuery["markets"]["nodes"][0];
};

const CompanyRegistrationPage = ({ company, market }: Props) => {
  // The company is created when we create the user in the db
  // through an sql procedure (create_account) here we just
  // need to update it with the new values
  return (
    <BmiThemeProvider>
      <EditCompanyDialog
        company={company}
        isOpen
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
  async ({ apolloClient, locale, account, globalPageData, market, res }) => {
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
          destination: "/company"
        }
      };
    }
    return {
      props: {
        company,
        market,
        account,
        ...(await serverSideTranslations(locale, ["common", "company-page"]))
      }
    };
  }
);

export default withPageAuthRequired(CompanyRegistrationPage);
