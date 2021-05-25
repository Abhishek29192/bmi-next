import React from "react";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { InfoPair } from "../../InfoPair";
import styles from "./styles.module.scss";

export type ProjectsHeaderProps = {
  title: string;
  projectCode: string;
  projectStatus: string;
  buildingAddress: string;
  projectDescription: string;
  startDate: string;
  endDate: string;
  guarantee: string;
  guaranteeStatus: string;
};

export const ProjectsHeader = ({
  title,
  projectCode,
  projectStatus,
  buildingAddress,
  projectDescription,
  startDate,
  endDate,
  guarantee,
  guaranteeStatus
}: ProjectsHeaderProps) => {
  const { t } = useTranslation("sidebar");

  return (
    <div className={styles.main}>
      <Typography variant="h4" hasUnderline>
        {title}
      </Typography>
      <div className={styles.body}>
        <InfoPair title={t("Project code")}>{projectCode}</InfoPair>
        <InfoPair title={t("Project status")}>{projectStatus}</InfoPair>
        <InfoPair title={t("Building address")}>{buildingAddress}</InfoPair>
        <InfoPair title={t("Project description")}>
          {projectDescription}
        </InfoPair>
        <InfoPair title={t("Project start date")}>{startDate}</InfoPair>
        <InfoPair title={t("Project end date")}>{endDate}</InfoPair>
        <InfoPair title={t("Guarantee")}>{guarantee}</InfoPair>
        <InfoPair title={t("Guarantee status")}>{guaranteeStatus}</InfoPair>
      </div>
    </div>
  );
};
