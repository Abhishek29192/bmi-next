import React from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "../../components/Layout";
import { withPage } from "../../lib/middleware/withPage";
import ProductImport from "../../components/Pages/ProductSystem";

const ProductsAndSystems = () => {
  const { t } = useTranslation();

  return (
    <Layout title={t("Product Import")}>
      <ProductImport />
    </Layout>
  );
};

export const getServerSideProps = withPage(async ({ locale, account }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "sidebar",
        "footer"
      ])),
      account
    }
  };
});

// TODO: fetch product by market
export const pageQuery = gql`
  query ProductsAndSystems {
    products {
      nodes {
        id
        name
        bmiRef
        published
        description
      }
    }
    systems {
      nodes {
        id
        name
        bmiRef
        description
        published
      }
    }
  }
`;

export const uploadProducts = gql`
  mutation bulkImport($input: BulkImportInput!) {
    bulkImport(input: $input) {
      systemsToInsert {
        bmiRef
      }
      systemsToUpdate {
        bmiRef
      }
      productsToInsert {
        bmiRef
      }
      productsToUpdate {
        bmiRef
      }
    }
  }
`;

export const updateProduct = gql`
  mutation updateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      product {
        id
      }
    }
  }
`;

export const updateSystem = gql`
  mutation updateSystem($input: UpdateSystemInput!) {
    updateSystem(input: $input) {
      system {
        id
      }
    }
  }
`;

export default withPageAuthRequired(ProductsAndSystems);
