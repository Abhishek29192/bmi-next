import React from "react";
import {
  ConfigProvider,
  envConfig,
  EnvConfig
} from "../../../contexts/ConfigProvider";

// Use this provider in cases when component need to be provided with some process.env variables
export const ConfigProviderMock = ({
  customConfig,
  children
}: {
  customConfig?: EnvConfig["config"];
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
