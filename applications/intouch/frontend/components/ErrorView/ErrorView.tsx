import React from "react";
import { useTranslation } from "next-i18next";
import { Typography } from "@bmi-digital/components";
import { Layout } from "../Layout";
import { useAccountContext } from "../../context/AccountContext";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";
import styles from "./styles.module.scss";

export type ErrorViewProps = {
  statusCode: number;
  title?: string;
  message?: string;
  globalPageData?: GetGlobalDataQuery;
};

// TODO: Use translations
const ErrorView = ({
  statusCode,
  title,
  globalPageData,
  message
}: ErrorViewProps) => {
  const { account } = useAccountContext();
  const { firstName, lastName } = account;
  const { t } = useTranslation("error-page");

  return (
    <Layout title={`${firstName} ${lastName}`} pageData={globalPageData}>
      <div className={styles.errorContentContainer}>
        {title ? (
          <Typography component="h1" variant="h1">
            {t(title)}
          </Typography>
        ) : null}
        {message ? (
          <Typography style={{ marginTop: 10 }} variant="body1">
            {t(message)}
          </Typography>
        ) : null}
      </div>
    </Layout>
  );
};

export default ErrorView;
