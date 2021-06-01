import React from "react";
import Button from "@bmi/button";
import { useTranslation } from "next-i18next";
import { NoContent } from "../../NoContent";
import styles from "./styles.module.scss";

export type GuaranteeTabProps = {
  children?: React.ReactNode | React.ReactNode[];
};

export const GuaranteeTab = ({ children }: GuaranteeTabProps) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Button>{t("Apply for a guarantee")}</Button>
      </div>
      <div className={styles.body}>
        {children}
        <NoContent message="No guarantee has been added yet" />
      </div>
    </div>
  );
};
