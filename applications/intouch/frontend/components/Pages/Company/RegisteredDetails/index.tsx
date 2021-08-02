import React, { useMemo } from "react";
import capitalize from "lodash.capitalize";
import { gql } from "@apollo/client";
import { Operation } from "@bmi/intouch-api-types";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { GetCompanyQuery } from "../../../../graphql/generated/operations";
import { InfoPair } from "../../../InfoPair";
import { Address } from "../../../Address";
import styles from "./styles.module.scss";

export type CompanyRegisteredDetailsProps = {
  company: GetCompanyQuery["company"];
};

export const formatCompanyOperations = (t, operations: Operation[]) => {
  const operationLabels = operations.map((operation) =>
    t(`company-page:operation_types.${operation}`)
  );

  const operationsText = operationLabels.reduce((str, o, idx) => {
    if (idx === 0) {
      return capitalize(o);
    }
    if (idx === operationLabels.length - 1) {
      return `${str} and ${o}`;
    }
    return `${str}, ${o}`;
  }, "");

  const suffix = t("company-page:company.operations_suffix");

  return operationLabels.length > 0 ? `${operationsText} ${suffix}` : "";
};

export const CompanyRegisteredDetails = ({
  company: {
    companyOperationsByCompany,
    name,
    referenceNumber,
    registeredAddress,
    taxNumber,
    tier
  }
}: CompanyRegisteredDetailsProps) => {
  const { t } = useTranslation(["common", "company-page"]);

  const operations = companyOperationsByCompany.nodes.map(
    (node) => node.operation
  );

  return (
    <div className={styles.main}>
      <Typography variant="h4" hasUnderline style={{ fontSize: "1.2rem" }}>
        {t("Registered Details")}
      </Typography>

      <div className={styles.body}>
        <InfoPair title={t("Registered name")}>{name}</InfoPair>

        <InfoPair title={t("Membership number")}>{referenceNumber}</InfoPair>

        {registeredAddress ? (
          <InfoPair title={t("Registered address")}>
            <Address address={registeredAddress} />
          </InfoPair>
        ) : null}

        <InfoPair title={t("Company VAT number")}>{taxNumber}</InfoPair>

        <InfoPair title={t("Tier")}>{tier}</InfoPair>

        {operations.length > 0 ? (
          <InfoPair title={t("company-page:company.operations")}>
            {formatCompanyOperations(t, operations)}
          </InfoPair>
        ) : null}
      </div>
    </div>
  );
};

export const CompanyRegisteredDetailsFragment = gql`
  fragment CompanyRegisteredDetailsFragment on Company {
    name
    referenceNumber
    registeredAddress {
      ...AddressLinesFragment
    }
    taxNumber
    tier
    companyOperationsByCompany {
      nodes {
        operation
      }
    }
  }
`;
