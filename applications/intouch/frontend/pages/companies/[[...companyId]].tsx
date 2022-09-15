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
import { parseMarketTag, sortArrayByField } from "../../lib/utils/";
import { GlobalPageProps, withPage } from "../../lib/middleware/withPage";
import { Layout } from "../../components/Layout";
import layoutStyles from "../../components/Layout/styles.module.scss";
import { CompaniesSidePanel } from "../../components/Pages/Company/SidePanel";
import { CompanyPage, NoCompanies } from "../../components/Pages/Company";

type CompaniesPageProps = GlobalPageProps & {
  companies?: GetCompaniesByMarketQuery["companies"]["nodes"];
  companySSR?: GetCompanyQuery["company"];
  contactDetailsCollection: GetCompanyQuery["contactDetailsCollection"];
  mapsApiKey: string;
};

const CompaniesPage = ({
  account,
  companies,
  companySSR,
  contactDetailsCollection,
  globalPageData,
  mapsApiKey,
  market
}: CompaniesPageProps) => {
  const { t } = useTranslation("company-page");
  const [company, setCompany] = useState(companySSR);
  const [companiesList, setCompaniesList] = useState(companies);
  const router = useRouter();
  const contentfulTag = parseMarketTag(market?.domain);
  const [updateCompaniesList] = useGetCompaniesByMarketLazyQuery({
    // we need the updated list for the profile complete status & name, we don't want cached results
    fetchPolicy: "no-cache",
    variables: {
      marketId: market.id,
      tag: contentfulTag
    },
    onCompleted: ({ companies }) => {
      setCompaniesList(sortArrayByField([...companies.nodes], "name"));
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
        mapsApiKey={mapsApiKey}
      />
    );
  }, [company]);

  return (
    <Layout
      title={t(isSuperOrMarketAdmin(account) ? "titleAdmin" : "titleMember")}
      pageData={globalPageData}
    >
      <div className={layoutStyles.sidePanelWrapper}>
        {isSuperOrMarketAdmin(account) ? (
          // TODO: Currently the whole layout is not very responsive on small screen sizes
          <>
            <CompaniesSidePanel
              companies={companiesList}
              onItemSelected={selectCompany}
              selectedItemId={company?.id}
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
  query GetCompaniesByMarket($marketId: Int!, $tag: String!) {
    companies(condition: { marketId: $marketId }) {
      nodes {
        ...CompanyPageDetailsFragment
        updatedAt
      }
    }
    contactDetailsCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
      ...ContactDetailsCollectionFragment
    }
  }
`;

export const GET_COMPANY_PAGE = gql`
  query GetCompany($companyId: Int!, $tag: String!) {
    company(id: $companyId) {
      ...CompanyPageDetailsFragment
    }
    contactDetailsCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
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
    const translations = await serverSideTranslations(locale, [
      "common",
      "sidebar",
      "footer",
      "company-page",
      "error-page"
    ]);
    const contentfulTag = parseMarketTag(market?.domain);

    if (params.companyId) {
      const companyId = parseInt(params.companyId);

      if (!can(account, "company", "view", { companyId })) {
        const statusCode = ErrorStatusCode.UNAUTHORISED;
        res.statusCode = statusCode;
        return generatePageError(
          statusCode,
          {},
          { globalPageData, ...translations }
        );
      }
      const {
        props: {
          data: { company, contactDetailsCollection }
        }
      } = await getServerPageGetCompany(
        { variables: { companyId, tag: contentfulTag } },
        apolloClient
      );

      const {
        props: {
          data: {
            companies: { nodes: companies }
          }
        }
      } = await getServerPageGetCompaniesByMarket(
        { variables: { marketId: market.id, tag: contentfulTag } },
        apolloClient
      );

      return {
        props: {
          companyId,
          companies: isSuperOrMarketAdmin(account)
            ? sortArrayByField([...companies], "name")
            : [],
          companySSR: company,
          contactDetailsCollection,
          mapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          ...translations
        }
      };
    }

    if (!can(account, "company", "viewAll")) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(
        statusCode,
        {},
        { globalPageData, ...translations }
      );
    }

    const {
      props: {
        data: {
          companies: { nodes: companies },
          contactDetailsCollection
        }
      }
    } = await getServerPageGetCompaniesByMarket(
      { variables: { marketId: market.id, tag: contentfulTag } },
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
        companies: sortArrayByField([...companies], "name"),
        mapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        contactDetailsCollection,
        ...translations
      }
    };
  }
);

export default withPageAuthRequired(
  withPageError<CompaniesPageProps>(CompaniesPage)
);
