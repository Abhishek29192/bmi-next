import React from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import { gql } from "@apollo/client";
import { exportCsv } from "../../../lib/utils/report";
import { useGetSystemsReportLazyQuery } from "../../../graphql/generated/hooks";
import { useMarketContext } from "../../../context/MarketContext";
import { ReportProps } from "../types";
import styles from "./styles.module.scss";

const SystemReport = ({ disabled }: ReportProps) => {
  const { t } = useTranslation("admin-products-systems");
  const { market } = useMarketContext();

  const [getSystemsReport] = useGetSystemsReportLazyQuery({
    variables: {
      marketId: market.id
    },
    onCompleted: ({ systems }) => {
      const data = [...systems.nodes].map((system) => {
        const members = system.systemMembersBySystemBmiRef.nodes
          .map((systemMember) => systemMember.productBmiRef)
          .join();

        const { __typename, systemMembersBySystemBmiRef, ...rest } = system;

        return { ...rest, members };
      });
      exportCsv(data, { filename: `system-${Date.now()}`, title: "System" });
    }
  });

  return (
    <div>
      <Button
        variant="outlined"
        data-testid="export-button"
        disabled={disabled}
        onClick={getSystemsReport}
        className={styles.sidePanelFooterButton}
      >
        {t("report.system")}
      </Button>
    </div>
  );
};

export default SystemReport;

export const GET_SYSTEMS = gql`
  query GetSystemsReport($marketId: Int) {
    systems(condition: { marketId: $marketId }) {
      nodes {
        id
        bmiRef
        name
        description
        technology
        maximumValidityYears
        systemMembersBySystemBmiRef {
          nodes {
            productBmiRef
          }
        }
        published
        updatedAt
      }
    }
  }
`;