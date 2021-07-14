import React from "react";
import { gql } from "@apollo/client";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { GetCompanyQuery } from "../../../graphql/generated/operations";
import { InfoPair } from "../../InfoPair";
import { Address } from "../../Address";
import styles from "./styles.module.scss";

export type CompanyRegisteredDetailsProps = {
  company: GetCompanyQuery["company"];
};

export const CompanyRegisteredDetails = ({
  company: { name, referenceNumber, registeredAddress, taxNumber, tier }
}: CompanyRegisteredDetailsProps) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.main}>
      <Typography variant="h4" hasUnderline style={{ fontSize: "1.2rem" }}>
        {t("Registered Details")}
      </Typography>
      <div className={styles.body}>
        <InfoPair title={t("Registered name")}>{name}</InfoPair>
        <InfoPair title={t("Membership number")}>{referenceNumber}</InfoPair>
        <InfoPair title={t("Registered address")}>
          <Address address={registeredAddress} />
        </InfoPair>
        <InfoPair title={t("Company VAT number")}>{taxNumber}</InfoPair>
        <InfoPair title={t("Tier")}>{tier}</InfoPair>
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
