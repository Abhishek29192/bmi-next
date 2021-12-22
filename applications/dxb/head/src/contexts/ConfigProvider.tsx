import React, { createContext, useContext, useState } from "react";

export const envConfig = {
  config: {
    isPreviewMode: process.env.GATSBY_PREVIEW,
    googleTagManagerID: process.env.GOOGLE_TAGMANAGER_ID,
    hubSpotId: process.env.GATSBY_HUBSPOT_ID,
    isSchemaORGActivated: process.env.GATSBY_SCHEMA_ORG_ACTIVATED,
    brandProviderToggler: process.env.GATSBY_ENABLE_BRAND_PROVIDER,
    gatsbyReCaptchaKey: process.env.GATSBY_RECAPTCHA_KEY,
    gatsbyReCaptchaNet: process.env.GATSBY_RECAPTCHA_NET,
    visualizerAssetUrl: process.env.GATSBY_VISUALISER_ASSETS_URL,
    documentDownloadEndpoint: process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT,
    gcpFormUploadEndpoint: process.env.GATSBY_GCP_FORM_UPLOAD_ENDPOINT,
    gcpFormSubmitEndpoint: process.env.GATSBY_GCP_FORM_SUBMIT_ENDPOINT,
    hubspotApiUrl: process.env.GATSBY_HUBSPOT_API_URL,
    gcpApsisEndpoint: process.env.GATSBY_GCP_APSIS_ENDPOINT,
    isCountryCodeProhibited: process.env.GATSBY_DONT_USE_COUNTRY_CODE,
    webtoolsCalculatorDataUrl: process.env.GATSBY_WEBTOOLS_CALCULATOR_DATA_URL,
    isWebToolsCalculatorEnabled: process.env.GATSBY_ENABLE_WEBTOOLS_CALCULATOR,
    webToolsCalculatorApsisEndpoint:
      process.env.GATSBY_WEBTOOLS_CALCULATOR_APSIS_ENDPOINT,
    documentDownloadMaxLimit: process.env.GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT,
    isRecomendedProductsHide: process.env.GATSBY_HIDE_RECOMMENDED_PRODUCTS,
    googleApiKey: process.env.GATSBY_GOOGLE_API_KEY,
    esIndexNameSystem: process.env.GATSBY_ES_INDEX_NAME_SYSTEMS,
    isDevMode: process.env.NODE_ENV === "development",
    gcpSystemConfiguratorEndpoint:
      process.env.GATSBY_GCP_SYSTEM_CONFIGURATOR_ENDPOINT
  }
};

type ConfigType = Record<string, string>;

interface ConfigContextValues {
  config: ConfigType;
  updateConfig?: (config: ConfigType) => void;
}

const ConfigContext = createContext<ConfigContextValues>({
  config: {},
  updateConfig: () => {}
});

export const ConfigProvider = ({
  configObject,
  children
}: {
  configObject: ConfigContextValues;
  children: React.ReactChild | React.ReactChildren;
}) => {
  const [{ config }, setUpdateConfig] = useState(configObject);
  const updateConfig = (updatedConfig: ConfigType) => {
    setUpdateConfig({
      config: { ...config, ...updatedConfig }
    });
  };
  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
