import React from "react";
import BmiThemeProvider from "@bmi/theme-provider";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getServerPageGetCompany } from "../graphql/generated/page";
import { GetCompanyQuery } from "../graphql/generated/operations";
import { findAccountCompany } from "../lib/account";
import { ErrorStatusCode, generatePageError } from "../lib/error";
import { withPage } from "../lib/middleware/withPage";
import { EditCompanyDialog } from "../components/Pages/Company/EditCompany/Dialog";

const Company = ({ company }: { company: GetCompanyQuery["company"] }) => {
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
  async ({
    apolloClient,
    locale,
    account,
    globalPageData,
    marketDomain,
    res
  }) => {
    const companyId = findAccountCompany(account)?.id;
    if (!companyId) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(statusCode, {}, { globalPageData });
    }
    const {
      props: {
        data: { company, markets }
      }
    } = await getServerPageGetCompany(
      { variables: { companyId, marketDomain } },
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
        market: markets.nodes?.[0],
        account,
        ...(await serverSideTranslations(locale, ["common", "company-page"]))
      }
    };
  }
);

export default withPageAuthRequired(Company);
