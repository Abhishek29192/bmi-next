import React, { createContext, useContext } from "react";
import { convertStrToBool } from "../utils/convertStrToBool";

export interface EnvConfig {
  config: {
    isPreviewMode?: boolean;
    googleTagManagerID?: string;
    hubSpotId?: string;
    isSchemaORGActivated?: boolean;
    brandProviderToggler?: boolean;
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
    documentDownloadMaxLimit?: string;
    isRecomendedProductsHide?: boolean;
    googleApiKey?: string;
    esIndexNameSystem?: string;
    isDevMode?: boolean;
    gcpSystemConfiguratorEndpoint?: string;
    isSampleOrderingEnabled?: boolean;
    isLegacyFiltersUsing?: boolean;
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
    brandProviderToggler: convertStrToBool(
      process.env.GATSBY_ENABLE_BRAND_PROVIDER
    ),
    gatsbyReCaptchaKey: process.env.GATSBY_RECAPTCHA_KEY,
    gatsbyReCaptchaNet: process.env.GATSBY_RECAPTCHA_NET,
    visualizerAssetUrl: process.env.GATSBY_VISUALISER_ASSETS_URL,
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
    webToolsCalculatorApsisEndpoint:
      process.env.GATSBY_WEBTOOLS_CALCULATOR_APSIS_ENDPOINT,
    documentDownloadMaxLimit: process.env.GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT,
    isRecomendedProductsHide: convertStrToBool(
      process.env.GATSBY_HIDE_RECOMMENDED_PRODUCTS
    ),
    googleApiKey: process.env.GATSBY_GOOGLE_API_KEY,
    esIndexNameSystem: process.env.GATSBY_ES_INDEX_NAME_SYSTEMS,
    isDevMode: process.env.NODE_ENV === "development",
    gcpSystemConfiguratorEndpoint:
      process.env.GATSBY_GCP_SYSTEM_CONFIGURATOR_ENDPOINT,
    isSampleOrderingEnabled: convertStrToBool(
      process.env.GATSBY_ENABLE_SAMPLE_ORDERING
    ),
    isLegacyFiltersUsing: convertStrToBool(
      process.env.GATSBY_USE_LEGACY_FILTERS
    )
  }
};

interface ConfigContextValues {
  config: EnvConfig["config"];
}

const ConfigContext = createContext<ConfigContextValues>({
  config: {}
});

export const ConfigProvider = ({
  configObject = envConfig,
  children
}: {
  configObject: ConfigContextValues;
  children: React.ReactChild | React.ReactChildren;
}) => (
  <ConfigContext.Provider value={configObject}>
    {children}
  </ConfigContext.Provider>
);

export const useConfig = () => useContext(ConfigContext);
