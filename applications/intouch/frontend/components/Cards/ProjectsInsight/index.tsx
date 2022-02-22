import React from "react";
import { Typography } from "@bmi/components";
import { useTranslation } from "next-i18next";
import classnames from "classnames";
import { InfoPair } from "../../InfoPair";
import { SimpleCard } from "../SimpleCard";
import styles from "./styles.module.scss";

export type ProjectsInsightProps = {
  daysRemaining: number;
  certifiedInstallers: number;
};

export const ProjectsInsight = ({
  daysRemaining,
  certifiedInstallers
}: ProjectsInsightProps) => {
  const { t } = useTranslation("sidebar");

  const isCertifiedInstallerExist = certifiedInstallers > 0;

  return (
    <SimpleCard>
      <Typography variant="h4" style={{ fontSize: "1.25rem" }} hasUnderline>
        {t("projectInsight")}
      </Typography>
      <div className={styles.body}>
        <Typography
          variant="h2"
          className={classnames({
            [styles["remainDays--warning"]]: daysRemaining < 0
          })}
        >
          {daysRemaining}
        </Typography>
        <InfoPair title={t("daysRemaining")}>{}</InfoPair>
      </div>
      <div className={styles.body}>
        <Typography
          variant="h2"
          className={classnames(styles["certificate"], {
            [styles["certificate--warning"]]: !isCertifiedInstallerExist
          })}
          data-testid="certified-installers"
        >
          {certifiedInstallers}
        </Typography>
        <InfoPair title={t("certifiedInstallers")}>
          {!isCertifiedInstallerExist
            ? t("noCertifiedInstallers")
            : t("projectsInsightCertifiedInstallers", {
                count: certifiedInstallers
              })}
        </InfoPair>
      </div>
    </SimpleCard>
  );
};
