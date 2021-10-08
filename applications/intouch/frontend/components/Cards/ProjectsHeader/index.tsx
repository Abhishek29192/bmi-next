import React from "react";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import { GuaranteeEventType, Technology } from "@bmi/intouch-api-types";
import Icon, { FlatRoof, PitchedRoof } from "@bmi/icon";
import { useTranslation } from "next-i18next";
import {
  GuaranteeStatus,
  guaranteeStatusIcons
} from "../../../lib/utils/guarantee";
import AccessControl from "../../../lib/permissions/AccessControl";
import { formatDate } from "../../../lib/utils/date";
import { Address, AddressProps } from "../../Address";
import { InfoPair } from "../../InfoPair";
import { SimpleCard } from "../SimpleCard";
import styles from "./styles.module.scss";

export type ProjectsHeaderProps = {
  title: string;
  technology: Technology;
  projectCode: string;
  projectStatus: string;
  buildingAddress: AddressProps["address"];
  projectDescription: string;
  roofArea: number;
  startDate: string;
  endDate: string;
  guaranteeType: string;
  guaranteeStatus: GuaranteeStatus;
  guaranteeEventType?: GuaranteeEventType;
  guaranteeEventHandler?: (status: GuaranteeEventType) => void;
  renderActions?: () => React.ReactNode;
};

export const ProjectsHeader = ({
  title,
  technology,
  projectCode,
  projectStatus,
  buildingAddress,
  projectDescription,
  roofArea,
  startDate,
  endDate,
  guaranteeType,
  guaranteeStatus,
  guaranteeEventType,
  guaranteeEventHandler,
  renderActions
}: ProjectsHeaderProps) => {
  const { t } = useTranslation("project-page");

  const technologyIcon: {
    [K in Exclude<Technology, "OTHER">]: React.FC<
      React.SVGProps<SVGSVGElement>
    >;
  } = {
    FLAT: FlatRoof,
    PITCHED: PitchedRoof
  };

  const StatusIconElement = guaranteeStatusIcons[guaranteeStatus];

  return (
    <SimpleCard>
      <div style={{ display: "flex" }}>
        <Typography variant="h3" hasUnderline>
          {title}
        </Typography>
        <Icon
          source={technologyIcon[technology as Technology]}
          className={styles.technologyIcon}
        />
      </div>
      <div className={styles.body}>
        <InfoPair title={t("projectDetails.code")}>{projectCode}</InfoPair>
        <InfoPair title={t("projectDetails.status")}>{projectStatus}</InfoPair>
        <InfoPair title={t("projectDetails.roofArea")}>
          {roofArea}m<sup>2</sup>
        </InfoPair>
        <InfoPair title={t("projectDetails.buildingAddress")}>
          <Address address={buildingAddress} />
        </InfoPair>
        <InfoPair title={t("projectDetails.description")}>
          {projectDescription}
        </InfoPair>
        <InfoPair title={t("projectDetails.startDate")}>
          {formatDate(startDate)}
        </InfoPair>
        <InfoPair title={t("projectDetails.endDate")}>
          {formatDate(endDate)}
        </InfoPair>
        <InfoPair title={t("projectDetails.guaranteeType")}>
          {guaranteeType}
        </InfoPair>
        <InfoPair title={t("projectDetails.guaranteeStatus")}>
          <div style={{ display: "flex" }}>
            {StatusIconElement}
            {t(`guarantee.status.${guaranteeStatus}`)}
          </div>
        </InfoPair>
      </div>
      {guaranteeEventType && (
        <AccessControl dataModel="project" action="adminActions">
          <div className={styles.footer}>
            <Button
              onClick={() => {
                guaranteeEventHandler &&
                  guaranteeEventHandler(guaranteeEventType);
              }}
              data-testid="guarantee-event-button"
            >
              {t(`projectDetails.cta.${guaranteeEventType}`)}
            </Button>
          </div>
        </AccessControl>
      )}
      {renderActions ? (
        <div className={styles.footer}>{renderActions()}</div>
      ) : null}
    </SimpleCard>
  );
};
