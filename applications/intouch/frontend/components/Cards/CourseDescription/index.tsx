import { Button, Icon, Typography } from "@bmi-digital/components";
import { Technology } from "@bmi/intouch-api-types";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useTranslation } from "next-i18next";
import React from "react";
import { technologyIcon, technologyNames } from "../../../lib/utils/course";
import { SimpleCard } from "../SimpleCard";
import styles from "./styles.module.scss";

export type CourseDescriptionProps = {
  title: string;
  type: string;
  status?: string;
  image?: string;
  technology?: Technology;
  lmsUrl?: string;
  children?: React.ReactNode | React.ReactNode[];
};

export const CourseDescription = ({
  title,
  type,
  status,
  image,
  technology,
  lmsUrl,
  children
}: CourseDescriptionProps) => {
  const { t } = useTranslation("training-page");

  return (
    <SimpleCard data-testid="courseDescription">
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
            <div className={styles.type}>{t(`training-page:type.${type}`)}</div>
            {technology && (
              <Typography className={styles.tech}>
                <Icon
                  // eslint-disable-next-line security/detect-object-injection
                  source={technologyIcon[technology]}
                  className={styles.technologyIcon}
                />
                {/* eslint-disable-next-line security/detect-object-injection */}
                {t(technologyNames[technology])}
              </Typography>
            )}

            <div className={styles.status}>
              <Typography variant="body1">
                {t(`training-page:${status}`)}
              </Typography>
            </div>
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
