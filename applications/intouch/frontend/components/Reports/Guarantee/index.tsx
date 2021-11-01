import React from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import { gql } from "@apollo/client";
import { GetApp } from "@material-ui/icons";
import { exportCsv } from "../../../lib/utils/report";
import { useGetGuaranteesReportLazyQuery } from "../../../graphql/generated/hooks";
import { GetGuaranteesReportQuery } from "../../../graphql/generated/operations";
import styles from "./styles.module.scss";

const getReportData = (guarantees: GetGuaranteesReportQuery["guarantees"]) => {
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

const GuaranteeReport = () => {
  const { t } = useTranslation("project-page");
  const [getSystemsReport] = useGetGuaranteesReportLazyQuery({
    onCompleted: ({ guarantees }) => {
      const data = getReportData(guarantees);

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
  query GetGuaranteesReport {
    guarantees {
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
