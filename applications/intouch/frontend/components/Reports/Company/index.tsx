import React from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import { gql } from "@apollo/client";
import { exportCsv } from "../../../lib/utils/report";
import { stringifyAddress } from "../../../lib/utils/address";
import { useGetCompaniesReportLazyQuery } from "../../../graphql/generated/hooks";
import { GetCompaniesReportQuery } from "../../../graphql/generated/operations";
import styles from "./styles.module.scss";

const getReportData = (companies: GetCompaniesReportQuery["companies"]) => {
  return [...companies.nodes]
    .map((company) => {
      const fullRegisteredAddress = stringifyAddress(company.registeredAddress);
      const fullTradingAddress = stringifyAddress(company.tradingAddress);
      const isTradingAddressCoordinate = !!company.tradingAddress?.coordinates;
      const operationType = company.companyOperationsByCompany.nodes
        .map((companyOperation) => companyOperation.operation)
        .join();

      const logoComplete = !!company.logo;

      const {
        __typename,
        registeredAddress,
        tradingAddress,
        companyOperationsByCompany,
        logo,
        taxNumber,
        ...rest
      } = company;

      return {
        ...rest,
        registeredAddress: fullRegisteredAddress,
        tradingAddress: fullTradingAddress,
        isTradingAddressCoordinate,
        operationType,
        logoComplete
      };
    })
    .sort(
      ({ updatedAt: firstDate }, { updatedAt: secondDate }) =>
        new Date(secondDate).getTime() - new Date(firstDate).getTime()
    );
};

const CompanyReport = () => {
  const { t } = useTranslation("company-page");
  const [getSystemsReport] = useGetCompaniesReportLazyQuery({
    onCompleted: ({ companies }) => {
      const data = getReportData(companies);
      exportCsv(data, {
        filename: `companies-${Date.now()}`,
        title: "Company"
      });
    }
  });

  return (
    <div>
      <Button
        variant="outlined"
        onClick={getSystemsReport}
        className={styles.sidePanelFooterButton}
      >
        {t("report")}
      </Button>
    </div>
  );
};

export default CompanyReport;

export const GET_COMPANIES_REPORT = gql`
  query GetCompaniesReport {
    companies {
      nodes {
        referenceNumber
        name
        tier
        registeredAddress {
          #egistered Address [all address lines concatenated]
          ...AddressLinesFragment
        }
        tradingAddress {
          #Trading Address [all address lines concatenated]
          ...AddressLinesFragment
          coordinates {
            #Trading Address Coordinates compete (y/n)
            x
            y
          }
        }
        logo
        aboutUs
        businessType
        companyOperationsByCompany {
          nodes {
            id
            operation
          }
        }
        isProfileComplete
        phone
        publicEmail
        website
        facebook
        linkedIn
        ownerFullname
        ownerEmail
        status
        taxNumber
        updatedAt
      }
    }
  }
`;
