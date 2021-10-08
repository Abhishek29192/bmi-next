import React from "react";
import Typography from "@bmi/typography";
import Icon from "@bmi/icon";
import { School } from "@material-ui/icons";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Button from "@bmi/button";
import { useTranslation } from "next-i18next";
import { SimpleCard } from "../SimpleCard";
import styles from "./styles.module.scss";

export type CourseDescriptionProps = {
  title: string;
  type: string;
  status?: string;
  image?: string;
  lmsUrl?: string;
  children?: React.ReactNode | React.ReactNode[];
};

export const CourseDescription = ({
  title,
  type,
  status,
  image,
  lmsUrl,
  children
}: CourseDescriptionProps) => {
  const { t } = useTranslation("training-page");

  return (
    <SimpleCard>
      <Typography variant="h4" hasUnderline>
        {title}
      </Typography>
      <div className={styles.header}>
        {image && (
          <div className={styles.bannerImage}>
            <img src={image} alt="" />
          </div>
        )}
        <div>
          <div className={styles.metadata}>
            <div className={styles.type}>
              <Icon source={School} />
              <Typography variant="h5">
                {t(`training-page:type.${type}`)}
              </Typography>
            </div>
            <div className={styles.status}>{status}</div>
          </div>
          <div className={styles.cta}>
            <Button
              startIcon={<ArrowForwardIcon />}
              variant="outlined"
              action={{
                model: "htmlLink",
                href: lmsUrl,
                target: "_blank",
                rel: "noopener noreferrer"
              }}
            >
              {t("viewTraining")}
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.body}>{children}</div>
    </SimpleCard>
  );
};
