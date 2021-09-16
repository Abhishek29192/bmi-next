import React from "react";
import capitalize from "lodash/capitalize";
import { gql } from "@apollo/client";
import { Operation } from "@bmi/intouch-api-types";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { GetCompanyQuery } from "../../../../graphql/generated/operations";
import { InfoPair } from "../../../InfoPair";
import { Address } from "../../../Address";
import { OnCompanyUpdateSuccess } from "../../../SetCompanyDetailsDialog";
import { EditCompanyButton } from "../EditCompany/Button";
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

  const suffix = t("company-page:companyOperationsSuffix");

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
        {t("company-page:details.registeredDetails")}
      </Typography>

      <div className={styles.body}>
        <InfoPair title={t("company-page:details.name")}>{name}</InfoPair>

        {referenceNumber ? (
          <InfoPair title={t("company-page:details.referenceNumber")}>
            {referenceNumber}
          </InfoPair>
        ) : null}

        {registeredAddress ? (
          <InfoPair title={t("company-page:details.registeredAddress")}>
            <Address address={registeredAddress} />
          </InfoPair>
        ) : null}

        {taxNumber ? (
          <InfoPair title={t("company-page:details.taxNumber")}>
            {taxNumber}
          </InfoPair>
        ) : null}

        {tier ? (
          <InfoPair title={t("Tier")}>{t(`common:tier.${tier}`)}</InfoPair>
        ) : null}

        {operations.length > 0 ? (
          <InfoPair title={t("company-page:companyOperations")}>
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
        id
        operation
      }
    }
  }
`;
