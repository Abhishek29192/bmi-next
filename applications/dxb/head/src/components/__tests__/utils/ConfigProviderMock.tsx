import React from "react";
import { ConfigProvider, envConfig } from "../../../contexts/ConfigProvider";

// Use this provider in cases when component need to be provided with some process.env variables
export const ConfigProviderMock = ({
  customConfig,
  children
}: {
  customConfig?: Record<string, string | boolean>;
  children: React.ReactChild | React.ReactChildren;
}) => {
  return (
    <ConfigProvider
      configObject={{ config: { ...envConfig.config, ...customConfig } }}
    >
      {children}
    </ConfigProvider>
  );
};
