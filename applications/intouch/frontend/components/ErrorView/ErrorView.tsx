import React from "react";
import Typography from "@bmi/typography";
import { Layout } from "../Layout";
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
  return (
    <Layout title={`Error: ${statusCode}`} pageData={globalPageData}>
      <div className={styles.errorContentContainer}>
        {title ? (
          <Typography component="h1" variant="h1">
            {title}
          </Typography>
        ) : null}
        {message ? (
          <Typography style={{ marginTop: 10 }} variant="body1">
            {message}
          </Typography>
        ) : null}
      </div>
    </Layout>
  );
};

export default ErrorView;
