import React, { useMemo } from "react";
import capitalize from "lodash.capitalize";
import { gql } from "@apollo/client";
import { Operation } from "@bmi/intouch-api-types";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { GetCompanyQuery } from "../../../../graphql/generated/operations";
import { InfoPair } from "../../../InfoPair";
import { Address } from "../../../Address";
import { EditCompanyButton } from "../EditCompany/Button";
import { OnCompanyUpdateSuccess } from "../EditCompany/Dialog";
import styles from "./styles.module.scss";

export type CompanyRegisteredDetailsProps = {
  company: GetCompanyQuery["company"];
  onCompanyUpdateSuccess?: OnCompanyUpdateSuccess;
};

export const formatCompanyOperations = (t, operations: Operation[]) => {
  const operationLabels = operations.map((operation) =>
    t(`company-page:operationTypes.${operation}`)
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
  company,
  onCompanyUpdateSuccess
}: CompanyRegisteredDetailsProps) => {
  const { t } = useTranslation(["common", "company-page"]);
  const {
    companyOperationsByCompany,
    name,
    referenceNumber,
    registeredAddress,
    taxNumber,
    tier
  } = company;
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

        {referenceNumber ? (
          <InfoPair title={t("Membership number")}>{referenceNumber}</InfoPair>
        ) : null}

        {registeredAddress ? (
          <InfoPair title={t("Registered address")}>
            <Address address={registeredAddress} />
          </InfoPair>
        ) : null}

        {taxNumber ? (
          <InfoPair title={t("Company VAT number")}>{taxNumber}</InfoPair>
        ) : null}

        {tier ? (
          <InfoPair title={t("Tier")}>{t(`common:tier.${tier}`)}</InfoPair>
        ) : null}

        {operations.length > 0 ? (
          <InfoPair title={t("company-page:company.operations")}>
            {formatCompanyOperations(t, operations)}
          </InfoPair>
        ) : null}

        <EditCompanyButton
          company={company}
          onCompanyUpdateSuccess={onCompanyUpdateSuccess}
        />
      </div>
    </div>
  );
};

export const CompanyRegisteredDetailsFragment = gql`
  fragment CompanyRegisteredDetailsFragment on Company {
    name
    referenceNumber
    registeredAddress {
      id
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
