import React from "react";
import ErrorView from "../components/ErrorView";

export enum ErrorStatusCode {
  UNAUTHORISED = 401
}

const errorMessages: Record<ErrorStatusCode, string> = {
  [ErrorStatusCode.UNAUTHORISED]: "Unauthorised"
};

export const generatePageError = function (
  statusCode: ErrorStatusCode,
  params = {}
) {
  const defaultTitle = errorMessages[`${statusCode}`] || "";

  return {
    props: {
      _pageError: {
        statusCode: statusCode,
        title: defaultTitle,
        ...params
      }
    }
  };
};

export type PageErrorProps = {
  _pageError: {
    statusCode: ErrorStatusCode;
    title?: string;
  };
};

export function withPageError<P extends Record<string, any>>(
  Component: React.ElementType
) {
  const ComponentWithPageError = (props: PageErrorProps & P) => {
    const { _pageError, ...componentProps } = props;

    if (_pageError) {
      const { statusCode, title } = _pageError;

      return <ErrorView statusCode={statusCode} title={title} />;
    }

    return <Component {...componentProps} />;
  };

  return ComponentWithPageError;
}
