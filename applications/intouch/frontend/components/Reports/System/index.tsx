import React from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import { gql } from "@apollo/client";
import { exportCsv } from "../../../lib/utils/report";
import { useGetSystemsReportLazyQuery } from "../../../graphql/generated/hooks";
import styles from "./styles.module.scss";

const SystemReport = () => {
  const { t } = useTranslation("admin-products-systems");
  const [getSystemsReport] = useGetSystemsReportLazyQuery({
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
  query GetSystemsReport {
    systems {
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
