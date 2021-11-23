import React from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import { gql } from "@apollo/client";
import { useGetProductsReportLazyQuery } from "../../../graphql/generated/hooks";
import { exportCsv } from "../../../lib/utils/report";
import { ReportProps } from "../types";
import styles from "./styles.module.scss";

const ProductReport = ({ disabled }: ReportProps) => {
  const { t } = useTranslation("admin-products-systems");

  const [getProductsReport] = useGetProductsReportLazyQuery({
    onCompleted: ({ products }) => {
      const data = [...products.nodes].map((product) => product);
      exportCsv(data, { filename: `product-${Date.now()}`, title: "Product" });
    }
  });

  return (
    <div>
      <Button
        variant="outlined"
        data-testid="export-button"
        disabled={disabled}
        onClick={getProductsReport}
        className={styles.sidePanelFooterButton}
      >
        {t("report.product")}
      </Button>
    </div>
  );
};
export default ProductReport;

export const GET_PRODUCTS = gql`
  query GetProductsReport {
    products {
      nodes {
        id
        bmiRef
        name
        description
        technology
        family
        brand
        maximumValidityYears
        published
        updatedAt
      }
    }
  }
`;
