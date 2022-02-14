import React from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi-digital/components/button";
import { gql } from "@apollo/client";
import { useGetProductsReportLazyQuery } from "../../../graphql/generated/hooks";
import { useMarketContext } from "../../../context/MarketContext";
import { exportCsv } from "../../../lib/utils/report";
import { ReportProps } from "../types";
import styles from "./styles.module.scss";

const ProductReport = ({ disabled }: ReportProps) => {
  const { t } = useTranslation("admin-products-systems");
  const { market } = useMarketContext();

  const [getProductsReport] = useGetProductsReportLazyQuery({
    variables: {
      marketId: market.id
    },
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
  query GetProductsReport($marketId: Int) {
    products(condition: { marketId: $marketId }) {
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
