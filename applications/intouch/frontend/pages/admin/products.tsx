import React from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "../../components/Layout";
import { GlobalPageProps, withPage } from "../../lib/middleware/withPage";
import ProductImport from "../../components/Pages/ProductSystem";
import { getServerPageProductsAndSystems } from "../../graphql/generated/page";
import { ProductsAndSystemsQuery } from "../../graphql/generated/operations";
import can from "../../lib/permissions/can";
import {
  ErrorStatusCode,
  generatePageError,
  withPageError
} from "../../lib/error";

type ProductsAndSystemsPageProps = GlobalPageProps & {
  ssrProducts: ProductsAndSystemsQuery["products"];
  ssrSystems: ProductsAndSystemsQuery["systems"];
  globalPageData: any;
};

const ProductsAndSystems = ({
  ssrProducts,
  ssrSystems,
  globalPageData
}: ProductsAndSystemsPageProps) => {
  const { t } = useTranslation();
  return (
    <Layout pageData={globalPageData} title={t("Product Import")}>
      <ProductImport products={ssrProducts} systems={ssrSystems} />
    </Layout>
  );
};

export const getServerSideProps = withPage(
  async ({ locale, account, apolloClient, globalPageData, market, res }) => {
    const translations = await serverSideTranslations(locale, [
      "admin-products-systems",
      "common",
      "sidebar",
      "footer",
      "error-page"
    ]);

    if (!can(account, "navigation", "productsAdmin")) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(
        statusCode,
        {},
        { globalPageData, ...translations }
      );
    }

    const {
      props: { data }
    } = await getServerPageProductsAndSystems(
      {
        variables: {
          marketId: market.id
        }
      },
      apolloClient
    );

    return {
      props: {
        ...translations,
        account,
        ssrProducts: data.products,
        ssrSystems: data.systems
      }
    };
  }
);

// TODO: fetch product by market
export const GetProductsAndSystems = gql`
  query ProductsAndSystems($marketId: Int) {
    products(orderBy: NAME_ASC, condition: { marketId: $marketId }) {
      nodes {
        id
        name
        brand
        family
        bmiRef
        updatedAt
        published
        technology
        description
        maximumValidityYears
      }
    }
    systems(orderBy: NAME_ASC, condition: { marketId: $marketId }) {
      nodes {
        id
        name
        bmiRef
        published
        updatedAt
        technology
        description
        maximumValidityYears
      }
    }
  }
`;

export default withPageAuthRequired(
  withPageError<ProductsAndSystemsPageProps>(ProductsAndSystems)
);
