import React from "react";
import { Layout } from "../Layout";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";

export type ErrorViewProps = {
  statusCode: number;
  title?: string;
  globalPageData?: GetGlobalDataQuery;
};

// TODO: Use translations
const ErrorView = ({ statusCode, title, globalPageData }: ErrorViewProps) => {
  return (
    <Layout title={`Error: ${statusCode}`} pageData={globalPageData}>
      {title ? <h1>{title}</h1> : null}
    </Layout>
  );
};

export default ErrorView;
