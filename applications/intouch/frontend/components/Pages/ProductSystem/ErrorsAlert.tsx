import React from "react";
import { useTranslation } from "next-i18next";
import AlertBanner from "@bmi/alert-banner";
import Typography from "@bmi/typography";
import styles from "./styles.module.scss";

type MessageProp = {
  ref: string;
  message: string;
};

type Props = {
  errorSystemsToUpdate: MessageProp[];
  errorSystemsToInsert: MessageProp[];
  errorProductsToUpdate: MessageProp[];
  errorProductsToInsert: MessageProp[];
  errorSystemMembersInsert: MessageProp[];
};

const Alert = (props: Props) => {
  const { t } = useTranslation("admin-products-systems");
  return (
    <div className={styles.alertContainer}>
      <AlertBanner severity="error">
        <AlertBanner.Title>{t("dryRunError")}</AlertBanner.Title>
        {Object.keys(props).map((key) => {
          const errors = props[`${key}`];

          return errors?.length ? (
            <div className={styles.message}>
              <Typography variant="h5" hasUnderline>
                {t(key)}
              </Typography>
              {errors.map(({ ref, message }) => (
                <Typography
                  key={`${key}-${ref}`}
                >{`${ref}: ${message}`}</Typography>
              ))}
            </div>
          ) : null;
        })}
      </AlertBanner>
    </div>
  );
};

export default Alert;
