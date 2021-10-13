import React from "react";
import { Technology } from "@bmi/intouch-api-types";
import Typography from "@bmi/typography";
import Icon, { FlatRoof, PitchedRoof, OtherTraining } from "@bmi/icon";
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
  technology?: Technology;
  lmsUrl?: string;
  children?: React.ReactNode | React.ReactNode[];
};

const technologyIcon: {
  [K in Technology]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  FLAT: FlatRoof,
  PITCHED: PitchedRoof,
  OTHER: OtherTraining
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

  const tech: { [K in Technology]: string } = {
    FLAT: t("technology.FLAT"),
    PITCHED: t("technology.PITCHED"),
    OTHER: t("technology.OTHER")
  };

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
            <div className={styles.type}>{t(`training-page:type.${type}`)}</div>
            {technology && (
              <div className={styles.tech}>
                <Icon
                  source={technologyIcon[technology]}
                  className={styles.technologyIcon}
                />

                <Typography variant="h6">{tech[technology]}</Typography>
              </div>
            )}
            <div className={styles.status}>
              <Typography variant="body1">{status}</Typography>
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
