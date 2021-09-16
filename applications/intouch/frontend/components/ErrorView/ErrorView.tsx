import React from "react";
import { Layout } from "../Layout";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";
import styles from "./styles.module.scss";

export type ErrorViewProps = {
  statusCode: number;
  title?: string;
  globalPageData?: GetGlobalDataQuery;
};

// TODO: Use translations
const ErrorView = ({ statusCode, title, globalPageData }: ErrorViewProps) => {
  return (
    <Layout title={`Error: ${statusCode}`} pageData={globalPageData}>
      <div className={styles.errorContentContainer}>
        {title ? <h1>{title}</h1> : null}
      </div>
    </Layout>
  );
};

export default ErrorView;
