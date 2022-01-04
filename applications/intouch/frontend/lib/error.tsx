import React from "react";
import ErrorView from "../components/ErrorView";

export enum ErrorStatusCode {
  UNAUTHORISED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

const errorMessages: Record<ErrorStatusCode, string> = {
  [ErrorStatusCode.UNAUTHORISED]: "Unauthorised",
  [ErrorStatusCode.NOT_FOUND]: "Not found",
  [ErrorStatusCode.INTERNAL_SERVER_ERROR]: "Internal server error"
};

export const generatePageError = function (
  statusCode: ErrorStatusCode,
  params = {},
  otherPageProps = {}
) {
  const defaultTitle = errorMessages[`${statusCode}`] || "";

  return {
    props: {
      _pageError: {
        statusCode: statusCode,
        title: defaultTitle,
        ...params
      },
      ...otherPageProps
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
      const { globalPageData } = componentProps;

      return (
        <ErrorView
          statusCode={statusCode}
          title={componentProps.title || title}
          globalPageData={globalPageData}
        />
      );
    }

    return <Component {...componentProps} />;
  };

  return ComponentWithPageError;
}
