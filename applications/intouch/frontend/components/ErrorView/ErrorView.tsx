import React from "react";
import { Layout } from "../Layout";

export type ErrorViewProps = {
  statusCode: number;
  title?: string;
};

// TODO: Use translations
const ErrorView = ({ statusCode, title }: ErrorViewProps) => {
  return (
    <Layout title={"Error: " + statusCode}>
      {title ? <h1>{title}</h1> : null}
    </Layout>
  );
};

export default ErrorView;
