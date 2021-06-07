import React from "react";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { InfoPair } from "../../InfoPair";
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
    <div className={styles.main}>
      <Typography variant="h4" style={{ fontSize: "1.25rem" }} hasUnderline>
        {t("Project insight")}
      </Typography>
      <div className={styles.body}>
        <Typography variant="h2">{daysRemaining}</Typography>
        <InfoPair title={t("Number of days remaining")}>
          {t("Total")}: {totalDays}
        </InfoPair>
      </div>
      <div className={styles.body}>
        <Typography variant="h2">{certifiedInstallers}</Typography>
        <InfoPair title={t("Certified installers")}>
          {/* TODO: This will need interpolated strings */}
          {t("There are no BMI certified installers")}
        </InfoPair>
      </div>
    </div>
  );
};
