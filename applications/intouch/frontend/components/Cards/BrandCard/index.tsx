import React from "react";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import { useTranslation } from "next-i18next";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import styles from "./styles.module.scss";

export type BrandCardProps = {
  title: string;
  content: string;
  link: string;
  logo: string;
  bannerImage: string;
};

export const BrandCard = ({
  title,
  content,
  link,
  logo,
  bannerImage
}: BrandCardProps) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <img src={bannerImage} />
        <div className={styles.logo}>
          <img src={logo} />
        </div>
      </div>
      <div className={styles.body}>
        <Typography variant="h3" hasUnderline style={{ fontSize: "1.5rem" }}>
          {title}
        </Typography>

        <div className={styles.content}>
          <Typography>{content}</Typography>
        </div>
      </div>

      <div className={styles.footer}>
        <Button endIcon={<ArrowForwardIcon />} variant="outlined">
          {t("Read More")}
        </Button>
      </div>
    </div>
  );
};
