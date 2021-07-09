import React from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { SSRConfig } from "next-i18next";
import Grid from "@bmi/grid";
import { Layout } from "../components/Layout";
import GridStyles from "../styles/Grid.module.scss";
import { CompanyHeader } from "../components/Cards/CompanyHeader";
import { CompanyRegisteredDetails } from "../components/Cards/CompanyRegisteredDetails";
import { SmallProfileCard } from "../components/Cards/SmallProfileCard";
import { CertificationsCard } from "../components/Cards/Certifications";
import { SupportContactCard } from "../components/Cards/SupportContactCard";
import { CompanyIncompleteProfileAlert } from "../components/Pages/CompanyIncompleteProfile";
import {
  ErrorStatusCode,
  generatePageError,
  withPageError
} from "../lib/error";
import {
  GetCompanyQuery,
  GetGlobalDataQuery
} from "../graphql/generated/operations";
import {
  getServerPageGetCompany,
  getServerPageGetCurrentCompany
} from "../graphql/generated/page";
import { withPage } from "../lib/middleware/withPage";
import { validateCompanyProfile } from "../lib/validations/company";
import { ROLES } from "../lib/config";

type CompanyPageProps = {
  company: GetCompanyQuery["company"];
  contactDetailsCollection: GetCompanyQuery["contactDetailsCollection"];
  globalPageData: GetGlobalDataQuery;
};
type SSRPageProps = CompanyPageProps & SSRConfig;

export const CompanyDetailsFragment = gql`
  fragment CompanyDetailsFragment on Company {
    id
    name
    phone
    website
    aboutUs
    tradingAddress {
      ...AddressLinesFragment
    }
    registeredAddress {
      ...AddressLinesFragment
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
    companyMembers {
      nodes {
        account {
          role
          id
          firstName
          lastName
          role
          phone
          email
          photo
        }
      }
    }
  }
`;

const CompanyAdmins = ({
  allMembers
}: {
  allMembers: GetCompanyQuery["company"]["companyMembers"]["nodes"];
}) => {
  const { t } = useTranslation("common");

  const admins = allMembers.filter(
    ({ account }) => account.role == ROLES.COMPANY_ADMIN
  );

  return (
    <Grid item xs={12} lg={7} xl={8}>
      <Grid container spacing={3} alignItems="stretch">
        {admins.map(({ account }) => (
          <Grid item xs={12} md={6} key={account.id}>
            <SmallProfileCard
              name={[account.firstName, account.lastName].join(" ")}
              jobTitle={t(account.role)}
              phoneNumber={account.phone}
              emailAddress={account.email}
              avatar={account.photo}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

const CompanyPage = ({
  company,
  contactDetailsCollection,
  globalPageData
}: CompanyPageProps) => {
  const { t } = useTranslation("company-page");
  const { missingFields: companyProfileMissingFields } =
    validateCompanyProfile(company);

  return (
    <Layout title={t("Company")} pageData={globalPageData}>
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
          <CompanyHeader company={company} />
        </Grid>

        <Grid item xs={12} lg={5} xl={4}>
          <CompanyRegisteredDetails company={company} />
        </Grid>

        <CompanyAdmins allMembers={company.companyMembers.nodes} />

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

export const GET_CURRENT_COMPANY = gql`
  query GetCurrentCompany {
    currentCompany
  }
`;

export const GET_COMPANY_PAGE = gql`
  query GetCompany($companyId: Int!) {
    company(id: $companyId) {
      logo
      tradingAddress {
        ...AddressLinesFragment
        # These are required for the Alert banner
        coordinates {
          x
          y
        }
      }
      ...CompanyDetailsFragment
      ...CompanyCertifications
    }
    contactDetailsCollection {
      ...ContactDetailsCollectionFragment
    }
  }
`;

export const getServerSideProps = withPage(
  async ({ locale, apolloClient, globalPageData, res }) => {
    const {
      props: {
        data: { currentCompany }
      }
    } = await getServerPageGetCurrentCompany({}, apolloClient);

    if (!currentCompany) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(404);
    }

    const {
      props: {
        data: { company, contactDetailsCollection }
      }
    } = await getServerPageGetCompany(
      { variables: { companyId: currentCompany } },
      apolloClient
    );
    return {
      props: {
        company,
        contactDetailsCollection,
        globalPageData,
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
