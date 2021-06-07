import React from "react";
import Typography from "@bmi/typography";
import Icon from "@bmi/icon";
import { School } from "@material-ui/icons";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Button from "@bmi/button";
import { useTranslation } from "next-i18next";
import { GenericCard } from "../Generic";
import styles from "./styles.module.scss";

export type CourseDescriptionProps = {
  title: string;
  type: string;
  status: string;
  children?: React.ReactNode | React.ReactNode[];
};

export const CourseDescription = ({
  title,
  type,
  status,
  children
}: CourseDescriptionProps) => {
  const { t } = useTranslation("common");

  return (
    <GenericCard title={title}>
      <div className={styles.header}>
        <div className={styles.bannerImage}></div>
        <div>
          <div className={styles.metadata}>
            <div className={styles.type}>
              <Icon source={School} />
              <Typography variant="h5">{type}</Typography>
            </div>
            <div className={styles.status}>{status}</div>
          </div>
          <div className={styles.cta}>
            <Button startIcon={<ArrowForwardIcon />} variant="outlined">
              {t("View training")}
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.body}>{children}</div>
    </GenericCard>
  );
};
