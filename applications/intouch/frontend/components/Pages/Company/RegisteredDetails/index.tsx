import React, { useMemo } from "react";
import capitalize from "lodash/capitalize";
import { Operation } from "@bmi/intouch-api-types";
import { Typography } from "@bmi/components";
import { useTranslation } from "next-i18next";
import { GetCompanyQuery } from "../../../../graphql/generated/operations";
import { useGetTierBenefitQuery } from "../../../../graphql/generated/hooks";
import { InfoPair } from "../../../InfoPair";
import { Address } from "../../../Address";
import { OnCompanyUpdateSuccess } from "../../../SetCompanyDetailsDialog";
import { EditCompanyButton } from "../EditCompany/Button";
import { parseMarketTag } from "../../../../lib/utils";
import { useMarketContext } from "../../../../context/MarketContext";
import {
  useCompanyPageContext,
  ContextProps
} from "../../../../context/CompanyPageContext";
import styles from "./styles.module.scss";

export type CompanyRegisteredDetailsProps = {
  company: GetCompanyQuery["company"];
  onCompanyUpdateSuccess?: OnCompanyUpdateSuccess;
  mapsApiKey: string;
};

export const formatCompanyOperations = (
  t,
  operations: Operation[],
  operationTypes: ContextProps["value"]["operationTypes"]
) => {
  const operationLabels = operations.map(
    (operation) =>
      operationTypes?.find(({ type }) => type === operation)?.displayName ||
      operation
  );

  const operationsText = operationLabels.reduce((str, o, idx) => {
    if (idx === 0) {
      return capitalize(o);
    }
    if (idx === operationLabels.length - 1) {
      return `${str} and ${o.toLowerCase()}`;
    }
    return `${str}, ${o}`;
  }, "");

  const suffix = t("company-page:companyOperationsSuffix");

  return operationLabels.length > 0 ? `${operationsText} ${suffix}` : "";
};

export const CompanyRegisteredDetails = ({
  company,
  mapsApiKey,
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
  const { market } = useMarketContext();
  const { operationTypes } = useCompanyPageContext();
  const contentfulTag = parseMarketTag(market?.domain);
  const { data: getTierBenefit } = useGetTierBenefitQuery({
    variables: { tag: contentfulTag }
  });
  const operations = companyOperationsByCompany.nodes.map(
    (node) => node.operation
  );
  const tierName = useMemo(() => {
    const tierBenefit = getTierBenefit?.tierBenefitCollection.items.find(
      ({ tier: tierBenefit }) => tierBenefit === tier
    );
    return tierBenefit?.name || null;
  }, [getTierBenefit, company]);

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

        {tier && tierName ? (
          <InfoPair title={t("Tier")}>{tierName}</InfoPair>
        ) : null}

        {operations.length > 0 ? (
          <InfoPair title={t("company-page:companyOperations")}>
            {formatCompanyOperations(t, operations, operationTypes)}
          </InfoPair>
        ) : null}

        <EditCompanyButton
          company={company}
          mapsApiKey={mapsApiKey}
          onCompanyUpdateSuccess={onCompanyUpdateSuccess}
        />
      </div>
    </div>
  );
};
