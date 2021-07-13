import React from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import Typography from "@bmi/typography";
import Grid from "@bmi/grid";
import { Layout } from "../components/Layout";
import GridStyles from "../styles/Grid.module.scss";

import { CompanyHeader } from "../components/Cards/CompanyHeader";
import { CompanyRegisteredDetails } from "../components/Cards/CompanyRegisteredDetails";
import { SmallProfileCard } from "../components/Cards/SmallProfileCard";

import { CertificationsCard } from "../components/Cards/Certifications";
import { SimpleCard } from "../components/Cards/SimpleCard";
import { CompanyIncompleteProfileAlert } from "../components/Pages/CompanyIncompleteProfile";

import can from "../lib/permissions/can";
import {
  ErrorStatusCode,
  generatePageError,
  withPageError
} from "../lib/error";
import { GetCompanyQuery } from "../graphql/generated/operations";
import {
  getServerPageGetCompany,
  getServerPageGetCurrentCompany
} from "../graphql/generated/page";
import { withPage } from "../lib/middleware/withPage";
import { validateCompanyProfile } from "../lib/validations/company";

type PageProps = {
  company: GetCompanyQuery["company"];
};

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
    (member) => member.account.role == "COMPANY_ADMIN"
  );

  return (
    <Grid item xs={12} lg={7} xl={8}>
      <Grid container spacing={3} alignItems="stretch">
        {admins.map((member) => (
          <Grid item xs={12} md={6} key={member.account.id}>
            <SmallProfileCard
              name={member.account.firstName + " " + member.account.lastName}
              jobTitle={t(member.account.role)}
              phoneNumber={member.account.phone}
              emailAddress={member.account.email}
              avatar={member.account.photo}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

const CompanyPage = ({ company }: PageProps) => {
  const { t } = useTranslation("company-page");
  // TODO: where was this used?
  const { tradingAddress } = company;
  const { missingFields: companyProfileMissingFields } =
    validateCompanyProfile(company);

  return (
    <Layout title={t("Company")}>
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
          <SimpleCard>
            <Typography
              variant="h4"
              hasUnderline
              style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}
            >
              {t("Roofpro Support")}
            </Typography>
          </SimpleCard>

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

// # TODO: this address fragment should be placed in a new address component
export const AddressFragment = gql`
  fragment AddressFields on Address {
    firstLine
    secondLine
    town
    region
    country
    postcode
    coordinates {
      x
      y
    }
  }
`;

export const GET_COMPANY = gql`
  query GetCompany($companyId: Int!) {
    company(id: $companyId) {
      logo
      tradingAddress {
        ...AddressFields
      }
      ...CompanyDetailsFragment
      ...CompanyCertifications
    }
  }
`;

export const getServerSideProps = withPage(
  async ({ locale, apolloClient, account, res }) => {
    const pageProps = {
      company: null,
      ...(await serverSideTranslations(locale, [
        "common",
        "sidebar",
        "footer",
        "company-page"
      ]))
    };

    const {
      props: {
        data: { currentCompany }
      }
    } = await getServerPageGetCurrentCompany({}, apolloClient);

    if (currentCompany) {
      const data = await getServerPageGetCompany(
        { variables: { companyId: currentCompany } },
        apolloClient
      );
      const {
        props: {
          data: { company }
        }
      } = data;
      pageProps.company = company;
    }
    console.log(
      "pageProps.company.companyMembers.nodes",
      pageProps.company.companyMembers.nodes
    );
    console.log("account", account);

    const canViewPage = can(account, "company", "view", {
      companyMemberIds: pageProps.company
        ? pageProps.company.companyMembers.nodes.map(
            ({ account }) => account.id
          )
        : []
    });

    if (!canViewPage) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(404);
    }

    return { props: pageProps };
  }
);

export default withPageAuthRequired(withPageError<PageProps>(CompanyPage));
