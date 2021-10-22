import { gql } from "@apollo/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/dist/frontend";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import { Company } from "@bmi/intouch-api-types";
import {
  GetCompaniesByMarketQuery,
  GetCompanyQuery
} from "../../graphql/generated/operations";
import {
  getServerPageGetCompaniesByMarket,
  getServerPageGetCompany
} from "../../graphql/generated/page";
import { useGetCompaniesByMarketLazyQuery } from "../../graphql/generated/hooks";
import { isSuperOrMarketAdmin } from "../../lib/account";
import log from "../../lib/logger";
import can from "../../lib/permissions/can";
import {
  ErrorStatusCode,
  generatePageError,
  withPageError
} from "../../lib/error";
import { GlobalPageProps, withPage } from "../../lib/middleware/withPage";
import { Layout } from "../../components/Layout";
import layoutStyles from "../../components/Layout/styles.module.scss";
import { CompaniesSidePanel } from "../../components/Pages/Company/SidePanel";
import { CompanyPage, NoCompanies } from "../../components/Pages/Company";

type CompaniesPageProps = GlobalPageProps & {
  companies?: GetCompaniesByMarketQuery["companies"]["nodes"];
  companySSR?: GetCompanyQuery["company"];
  contactDetailsCollection: GetCompanyQuery["contactDetailsCollection"];
};

const CompaniesPage = ({
  account,
  companies,
  companySSR,
  contactDetailsCollection,
  globalPageData,
  market
}: CompaniesPageProps) => {
  const { t } = useTranslation("company-page");
  const [company, setCompany] = useState(companySSR);
  const [companiesList, setCompaniesList] = useState(companies);
  const router = useRouter();
  const [updateCompaniesList] = useGetCompaniesByMarketLazyQuery({
    // we need the updated list for the profile complete status & name, we don't want cached results
    fetchPolicy: "no-cache",
    variables: {
      marketId: market.id
    },
    onCompleted: ({ companies }) => {
      setCompaniesList(companies.nodes);
    },
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error updating companies list: ${error.toString()}`
      });
    }
  });

  const selectCompany = useCallback(
    (selectedCompanyId) => {
      setCompany(
        companiesList.find((c) => c.id === selectedCompanyId) as Company
      );
      router.push(`/companies/${selectedCompanyId}`, undefined, {
        shallow: true
      });
    },
    [setCompany, companiesList]
  );

  const companyScreen = useMemo(() => {
    return (
      <CompanyPage
        company={company}
        account={account}
        market={market}
        globalPageData={globalPageData}
        contactDetailsCollection={contactDetailsCollection}
        onCompanyUpdateSuccess={(updatedCompany) => {
          setCompany(updatedCompany);
          updateCompaniesList();
        }}
      />
    );
  }, [company]);

  return (
    <Layout
      title={t(isSuperOrMarketAdmin ? "titleAdmin" : "titleMember")}
      pageData={globalPageData}
    >
      <div className={layoutStyles.sidePanelWrapper}>
        {isSuperOrMarketAdmin(account) ? (
          // TODO: Currently the whole layout is not very responsive on small screen sizes
          <>
            <CompaniesSidePanel
              companies={companiesList}
              onItemSelected={selectCompany}
            />
            {company ? companyScreen : <NoCompanies />}
          </>
        ) : (
          companyScreen
        )}
      </div>
    </Layout>
  );
};

export const COMPANY_DETAILS_FRAGMENT = gql`
  fragment CompanyPageDetailsFragment on Company {
    id
    ...CompanyDetailsFragment
    ...CompanyRegisteredDetailsFragment
    ...CompanyAdminsFragment
    ...CompanyCertifications
    ...CompanyDocumentsFragment
    status
    isProfileComplete
  }
`;

export const GET_COMPANIES_BY_MARKET = gql`
  query GetCompaniesByMarket($marketId: Int!) {
    companies(condition: { marketId: $marketId }, orderBy: NAME_ASC) {
      nodes {
        ...CompanyPageDetailsFragment
      }
    }
    contactDetailsCollection {
      ...ContactDetailsCollectionFragment
    }
  }
`;

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

export const getServerSideProps = withPage(
  async ({
    locale,
    apolloClient,
    globalPageData,
    res,
    account,
    market,
    params
  }) => {
    if (params.companyId) {
      const companyId = parseInt(params.companyId);

      if (!can(account, "company", "view", { companyId })) {
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

      const {
        props: {
          data: {
            companies: { nodes: companies }
          }
        }
      } = await getServerPageGetCompaniesByMarket(
        { variables: { marketId: market.id } },
        apolloClient
      );

      return {
        props: {
          companyId,
          companies: isSuperOrMarketAdmin(account) ? companies : [],
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

    if (!can(account, "company", "viewAll")) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(statusCode, {}, { globalPageData });
    }

    const {
      props: {
        data: {
          companies: { nodes: companies },
          contactDetailsCollection
        }
      }
    } = await getServerPageGetCompaniesByMarket(
      { variables: { marketId: market.id } },
      apolloClient
    );

    if (companies.length > 0) {
      return {
        redirect: {
          permanent: false,
          destination: `/companies/${companies[0].id}`
        }
      };
    }

    return {
      props: {
        companies,
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
  withPageError<CompaniesPageProps>(CompaniesPage)
);
