import React from "react";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { InfoPair } from "../../InfoPair";
import { SimpleCard } from "../SimpleCard";
import styles from "./styles.module.scss";

export type ProjectsInsightProps = {
  daysRemaining: string;
  certifiedInstallers: string;
  totalDays: string;
};

export const ProjectsInsight = ({
  daysRemaining,
  certifiedInstallers,
  totalDays
}: ProjectsInsightProps) => {
  const { t } = useTranslation("sidebar");

  return (
    <SimpleCard>
      <Typography variant="h4" style={{ fontSize: "1.25rem" }} hasUnderline>
        {t("projectInsight")}
      </Typography>
      <div className={styles.body}>
        <Typography variant="h2">{daysRemaining}</Typography>
        <InfoPair title={t("daysRemaining")}>
          {t("Total")}: {totalDays}
        </InfoPair>
      </div>
      <div className={styles.body}>
        <Typography variant="h2">{certifiedInstallers}</Typography>
        <InfoPair title={t("certifiedInstallers")}>
          {/* TODO: This will need interpolated strings */}
          {t("noCertifiedInstallers")}
        </InfoPair>
      </div>
    </SimpleCard>
  );
};
