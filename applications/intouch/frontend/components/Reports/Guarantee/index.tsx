import React from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi-digital/components/button";
import { gql } from "@apollo/client";
import { GetApp } from "@material-ui/icons";
import { exportCsv } from "../../../lib/utils/report";
import { useGetGuaranteesReportLazyQuery } from "../../../graphql/generated/hooks";
import { GetGuaranteesReportQuery } from "../../../graphql/generated/operations";
import { useMarketContext } from "../../../context/MarketContext";
import { ReportProps } from "../types";
import styles from "./styles.module.scss";

const getReportData = (
  guarantees: GetGuaranteesReportQuery["guaranteesByMarket"]
) => {
  return [...guarantees.nodes].map((company) => {
    const {
      __typename,
      project,
      languageCode,
      guaranteeReferenceCode,
      guaranteeType,
      systemBySystemBmiRef,
      productByProductBmiRef,
      ...rest
    } = company;

    const {
      name: projectName,
      technology: projectTechnology,
      roofArea,
      company: { name: companyName }
    } = project;

    const { name: guaranteeTypeName, maximumValidityYears } =
      guaranteeType || {};
    const productName = productByProductBmiRef?.name;
    const systemName = systemBySystemBmiRef?.name;
    return {
      ...rest,
      projectName,
      projectTechnology,
      roofArea,
      companyName,
      guaranteeTypeName,
      maximumValidityYears,
      productName,
      systemName
    };
  });
};

const GuaranteeReport = ({ disabled }: ReportProps) => {
  const { t } = useTranslation("project-page");
  const { market } = useMarketContext();

  const [getSystemsReport] = useGetGuaranteesReportLazyQuery({
    variables: {
      market: market.id
    },
    onCompleted: ({ guaranteesByMarket }) => {
      const data = getReportData(guaranteesByMarket);

      exportCsv(data, {
        filename: `guarantees-${Date.now()}`,
        title: "Guarantee"
      });
    }
  });

  return (
    <div>
      <Button
        variant="outlined"
        data-testid="export-button"
        disabled={disabled}
        endIcon={<GetApp />}
        onClick={getSystemsReport}
        className={styles.sidePanelFooterButton}
      >
        {t("report.guarantee")}
      </Button>
    </div>
  );
};

export default GuaranteeReport;

export const GET_GUARANTEES_REPORT = gql`
  query GetGuaranteesReport($market: Int!) {
    guaranteesByMarket(market: $market) {
      nodes {
        id
        bmiReferenceId
        project {
          name
          technology
          roofArea
          company {
            name
          }
        }
        requestorAccountId
        coverage
        status
        languageCode
        guaranteeReferenceCode
        guaranteeType {
          name
          maximumValidityYears
        }
        startDate
        expiryDate
        signedFileStorageUrl
        systemBySystemBmiRef {
          name
        }
        productByProductBmiRef {
          name
        }
      }
    }
  }
`;
