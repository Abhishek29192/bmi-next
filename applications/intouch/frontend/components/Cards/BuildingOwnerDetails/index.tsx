import React from "react";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { Address, AddressProps } from "../../Address";
import { MaybeInfoPair } from "../../InfoPair";
import { NoContent } from "../../NoContent";
import { SimpleCard } from "../SimpleCard";
import styles from "./styles.module.scss";

export type BuildingOwnerDetailsProps = {
  name?: string;
  email?: string;
  company?: string;
  address?: AddressProps["address"];
  renderActions?: () => React.ReactNode;
};

const InfoPair = (props) => {
  const { t } = useTranslation("common");

  return (
    <MaybeInfoPair fallback={<i>{t("fallback.notAdded")}</i>} {...props} />
  );
};

export const BuildingOwnerDetails = ({
  name,
  email,
  company,
  address,
  renderActions
}: BuildingOwnerDetailsProps) => {
  const { t } = useTranslation("project-page");

  const empty = [name, email, company, address].filter(Boolean).length === 0;

  return (
    <SimpleCard>
      <Typography variant="h5">{t("buildingOwnerDetails.title")}</Typography>
      {empty ? (
        <NoContent message={t("buildingOwnerDetails.noContent")} />
      ) : (
        <div className={styles.body}>
          <InfoPair title={t("buildingOwnerDetails.name")}>{name}</InfoPair>
          <InfoPair title={t("buildingOwnerDetails.email")}>{email}</InfoPair>
          <InfoPair title={t("buildingOwnerDetails.company")}>
            {company}
          </InfoPair>
          <InfoPair title={t("buildingOwnerDetails.address")}>
            <Address address={address} />
          </InfoPair>
        </div>
      )}
      {renderActions ? (
        <div className={styles.footer}>{renderActions()}</div>
      ) : null}
    </SimpleCard>
  );
};
