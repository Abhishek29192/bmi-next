import React from "react";
import { Document } from "@contentful/rich-text-types";
import { Typography } from "@bmi/components";
import { Button } from "@bmi/components";
import { useTranslation } from "next-i18next";
import { RichText } from "../../RichText";
import styles from "./styles.module.scss";

export type BrandCardProps = {
  id: string;
  title: string;
  link: string;
  logo: string;
  bannerImage: string;
  description: Document;
};

export const BrandCard = ({
  id,
  title,
  description,
  link,
  logo,
  bannerImage
}: BrandCardProps) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.main} id={id}>
      <div className={styles.header}>
        <div className={styles.banner}>
          <img src={bannerImage} />
        </div>
        <div className={styles.logo}>
          <img src={logo} />
        </div>
      </div>
      <div className={styles.body}>
        <Typography variant="h3" hasUnderline style={{ fontSize: "1.5rem" }}>
          {title}
        </Typography>

        <div className={styles.content}>
          <RichText content={description} />
        </div>
      </div>

      <div className={styles.footer}>
        <Button href={link}>{t("visitWebsite")}</Button>
      </div>
    </div>
  );
};
