import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Grid from "@bmi/grid";
import { useCallback } from "react";
import { GetCompanyQuery } from "../../graphql/generated/operations";
import { getServerPageGetCompany } from "../../graphql/generated/page";
import { findAccountCompany } from "../../lib/account";
import { ROLES } from "../../lib/constants";
import {
  ErrorStatusCode,
  generatePageError,
  withPageError
} from "../../lib/error";
import { GlobalPageProps, withPage } from "../../lib/middleware/withPage";
import { validateCompanyProfile } from "../../lib/validations/company";
import { Layout } from "../../components/Layout";
import { CompanyIncompleteProfileAlert } from "../../components/Pages/Company/IncompleteProfileAlert";
import { CompanyDetails } from "../../components/Pages/Company/Details";
import { CompanyRegisteredDetails } from "../../components/Pages/Company/RegisteredDetails";
import { CertificationsCard } from "../../components/Cards/Certifications";
import { SupportContactCard } from "../../components/Cards/SupportContactCard";
import { EditCompanyButton } from "../../components/Pages/Company/EditCompany/Button";
import { CompanyAdmins } from "../../components/Pages/Company/Admins";
import GridStyles from "../../styles/Grid.module.scss";

type CompanyPageProps = GlobalPageProps & {
  companySSR: GetCompanyQuery["company"];
  contactDetailsCollection: GetCompanyQuery["contactDetailsCollection"];
};

const CompanyPage = ({
  companySSR,
  contactDetailsCollection,
  globalPageData
}: CompanyPageProps) => {
  const { t } = useTranslation("company-page");
  const [company, setCompany] = useState(companySSR);
  const { missingFields: companyProfileMissingFields } =
    validateCompanyProfile(company);

  const onCompanyUpdateSuccess = useCallback(
    (updatedCompany: GetCompanyQuery["company"]) => {
      setCompany(updatedCompany);
    },
    [setCompany]
  );

  return (
    <Layout title={t("title")} pageData={globalPageData}>
      {companyProfileMissingFields.length > 0 && (
        <CompanyIncompleteProfileAlert
          missingFields={companyProfileMissingFields}
        />
      )}
      <Grid
        container
        spacing={3}
        className={GridStyles.outerGrid}
        alignItems="stretch"
      >
        <Grid item xs={12} lg={7} xl={8}>
          <CompanyDetails
            company={company}
            showName={false}
            actions={
              <EditCompanyButton
                company={company}
                onCompanyUpdateSuccess={onCompanyUpdateSuccess}
              />
            }
          />
        </Grid>

        <Grid item xs={12} lg={5} xl={4}>
          <CompanyRegisteredDetails
            company={company}
            onCompanyUpdateSuccess={onCompanyUpdateSuccess}
          />
        </Grid>

        <Grid item xs={12} lg={7} xl={8}>
          <CompanyAdmins
            admins={company.companyMembers.nodes.filter(
              ({ account }) => account.role === ROLES.COMPANY_ADMIN
            )}
          />
        </Grid>

        <Grid item xs={12} lg={5} xl={4}>
          <SupportContactCard
            contactDetailsCollection={contactDetailsCollection}
          />

          {company.certifications.length > 0 && (
            <CertificationsCard
              title={t("BMI Certifications")}
              certifications={company.certifications}
            />
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};

export const GET_COMPANY_PAGE = gql`
  query GetCompany($companyId: Int!) {
    company(id: $companyId) {
      ...CompanyPageDetailsFragment
    }
    contactDetailsCollection {
      ...ContactDetailsCollectionFragment
    }
  }
`;

export const COMPANY_DETAILS_FRAGMENT = gql`
  fragment CompanyPageDetailsFragment on Company {
    id
    ...CompanyDetailsFragment
    ...CompanyRegisteredDetailsFragment
    ...CompanyAdminsFragment
    ...CompanyCertifications
    status
  }
`;

export const getServerSideProps = withPage(
  async ({ locale, apolloClient, globalPageData, res, account, params }) => {
    const companyId = parseInt(params.companyId);

    if (
      ![ROLES.SUPER_ADMIN, ROLES.MARKET_ADMIN].includes(account.role) &&
      companyId !== findAccountCompany(account)?.id
    ) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(statusCode, {}, { globalPageData });
    }

    const {
      props: {
        data: { company, contactDetailsCollection }
      }
    } = await getServerPageGetCompany(
      { variables: { companyId } },
      apolloClient
    );

    return {
      props: {
        companySSR: company,
        contactDetailsCollection,
        ...(await serverSideTranslations(locale, [
          "common",
          "sidebar",
          "footer",
          "company-page"
        ]))
      }
    };
  }
);

export default withPageAuthRequired(
  withPageError<CompanyPageProps>(CompanyPage)
);
