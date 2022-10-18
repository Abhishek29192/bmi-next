import React, { createContext, useContext } from "react";
import { convertStrToBool } from "../utils/convertStrToBool";

export interface EnvConfig {
  config: {
    isPreviewMode?: boolean;
    googleTagManagerID?: string;
    hubSpotId?: string;
    isSchemaORGActivated?: boolean;
    isBrandProviderEnabled?: boolean;
    gatsbyReCaptchaKey?: string;
    gatsbyReCaptchaNet?: string;
    visualizerAssetUrl?: string;
    documentDownloadEndpoint?: string;
    gcpFormUploadEndpoint?: string;
    gcpFormSubmitEndpoint?: string;
    hubspotApiUrl?: string;
    gcpApsisEndpoint?: string;
    isCountryCodeProhibited?: boolean;
    webtoolsCalculatorDataUrl?: string;
    isWebToolsCalculatorEnabled?: boolean;
    webToolsCalculatorApsisEndpoint?: string;
    documentDownloadMaxLimit?: number;
    googleApiKey?: string;
    esIndexNameSystem?: string;
    esIndexNameProduct?: string;
    isDevMode?: boolean;
    gcpSystemConfiguratorEndpoint?: string;
    isLegacyFiltersUsing?: boolean;
    spaceMarketCode?: string;
    isV2WebToolsCalculatorEnabled?: boolean;
    isV2VisualiserEnabled?: boolean;
    isSpaEnabled?: boolean;
    isGatsbyDisabledElasticSearch?: boolean;
    oneTrustId?: string;
  };
}

export const envConfig: EnvConfig = {
  config: {
    isPreviewMode: convertStrToBool(process.env.GATSBY_PREVIEW),
    googleTagManagerID: process.env.GOOGLE_TAGMANAGER_ID,
    hubSpotId: process.env.GATSBY_HUBSPOT_ID,
    isSchemaORGActivated: convertStrToBool(
      process.env.GATSBY_SCHEMA_ORG_ACTIVATED
    ),
    isBrandProviderEnabled: convertStrToBool(
      process.env.GATSBY_ENABLE_BRAND_PROVIDER
    ),
    gatsbyReCaptchaKey: process.env.GATSBY_RECAPTCHA_KEY,
    gatsbyReCaptchaNet: process.env.GATSBY_RECAPTCHA_NET,
    visualizerAssetUrl: process.env.GATSBY_VISUALISER_ASSETS_URL,
    isV2VisualiserEnabled: convertStrToBool(
      process.env.GATSBY_ENABLE_V2_WEBTOOLS_VISUALISATOR
    ),
    documentDownloadEndpoint: process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT,
    gcpFormUploadEndpoint: process.env.GATSBY_GCP_FORM_UPLOAD_ENDPOINT,
    gcpFormSubmitEndpoint: process.env.GATSBY_GCP_FORM_SUBMIT_ENDPOINT,
    hubspotApiUrl: process.env.GATSBY_HUBSPOT_API_URL,
    gcpApsisEndpoint: process.env.GATSBY_GCP_APSIS_ENDPOINT,
    isCountryCodeProhibited: convertStrToBool(
      process.env.GATSBY_DONT_USE_COUNTRY_CODE
    ),
    webtoolsCalculatorDataUrl: process.env.GATSBY_WEBTOOLS_CALCULATOR_DATA_URL,
    isWebToolsCalculatorEnabled: convertStrToBool(
      process.env.GATSBY_ENABLE_WEBTOOLS_CALCULATOR
    ),
    isV2WebToolsCalculatorEnabled: convertStrToBool(
      process.env.GATSBY_ENABLE_V2_WEBTOOLS_CALCULATOR
    ),
    webToolsCalculatorApsisEndpoint:
      process.env.GATSBY_WEBTOOLS_CALCULATOR_APSIS_ENDPOINT,
    documentDownloadMaxLimit:
      +process.env.GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT || 100,
    googleApiKey: process.env.GATSBY_GOOGLE_API_KEY,
    esIndexNameSystem: process.env.GATSBY_ES_INDEX_NAME_SYSTEMS,
    esIndexNameProduct: process.env.GATSBY_ES_INDEX_NAME_PRODUCTS,
    isDevMode: process.env.NODE_ENV === "development",
    gcpSystemConfiguratorEndpoint:
      process.env.GATSBY_GCP_SYSTEM_CONFIGURATOR_ENDPOINT,
    oneTrustId: process.env.ONETRUST_ID,
    isSpaEnabled: convertStrToBool(process.env.GATSBY_IS_SPA_ENABLED),
    isGatsbyDisabledElasticSearch: convertStrToBool(
      process.env.GATSBY_DISABLE_SEARCH
    )
  }
};

interface ConfigContextValues {
  config: EnvConfig["config"];
}

const ConfigContext = createContext<ConfigContextValues>({
  config: envConfig.config
});

export const ConfigProvider = ({
  configObject,
  children
}: {
  configObject?: EnvConfig["config"];
  children: React.ReactChild | React.ReactChildren;
}) => (
  <ConfigContext.Provider
    value={{ config: { ...envConfig.config, ...configObject } }}
  >
    {children}
  </ConfigContext.Provider>
);

export const useConfig = () => useContext(ConfigContext);
