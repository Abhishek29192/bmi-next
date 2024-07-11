import React, { createContext, useContext } from "react";
import { convertStrToBool } from "../utils/convertStrToBool";

export interface Config {
  isPreviewMode: boolean;
  googleTagManagerID?: string;
  hubSpotId?: string;
  isSchemaORGActivated: boolean;
  isBrandProviderEnabled: boolean;
  reCaptchaKey?: string;
  reCaptchaNet?: string;
  visualizerAssetUrl?: string;
  documentDownloadEndpoint?: string;
  gcpFormUploadEndpoint?: string;
  gcpFormSubmitEndpoint?: string;
  gcpApsisEndpoint?: string;
  isCountryCodeProhibited: boolean;
  webtoolsCalculatorDataUrl?: string;
  isWebToolsCalculatorEnabled: boolean;
  webToolsCalculatorApsisEndpoint?: string;
  documentDownloadMaxLimit?: number;
  googleApiKey?: string;
  esIndexNameSystem?: string;
  esIndexNameProduct?: string;
  esIndexNameTrainings?: string;
  isDevMode: boolean;
  gcpSystemConfiguratorEndpoint?: string;
  isLegacyFiltersUsing: boolean;
  spaceMarketCode?: string;
  isV2WebToolsCalculatorEnabled: boolean;
  isV2VisualiserEnabled: boolean;
  isNextDisabledElasticSearch: boolean;
  oneTrustId?: string;
  isSampleOrderingEnabled: boolean;
  renderTeamCategoriesAsRows: boolean;
  enableProductClassificationAttributeOrdering: boolean;
  isLoginEnabled: boolean;
  excludeLocalisedAlternate: boolean;
  marketLocaleCode?: string;
  countryName?: string;
}

const envConfig = (): Config => ({
  isPreviewMode: convertStrToBool(process.env.GATSBY_PREVIEW),
  googleTagManagerID: process.env.GOOGLE_TAGMANAGER_ID,
  hubSpotId: process.env.NEXT_PUBLIC_HUBSPOT_ID,
  isSchemaORGActivated: convertStrToBool(
    process.env.GATSBY_SCHEMA_ORG_ACTIVATED
  ),
  isBrandProviderEnabled: convertStrToBool(
    process.env.NEXT_PUBLIC_ENABLE_BRAND_PROVIDER
  ),
  reCaptchaKey: process.env.NEXT_PUBLIC_RECAPTCHA_KEY,
  reCaptchaNet: process.env.NEXT_PUBLIC_RECAPTCHA_NET,
  visualizerAssetUrl: process.env.NEXT_PUBLIC_VISUALISER_ASSETS_URL,
  isV2VisualiserEnabled: convertStrToBool(
    process.env.NEXT_PUBLIC_ENABLE_V2_WEBTOOLS_VISUALISATOR
  ),
  documentDownloadEndpoint: process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT,
  gcpFormUploadEndpoint: process.env.NEXT_PUBLIC_GCP_FORM_UPLOAD_ENDPOINT,
  gcpFormSubmitEndpoint: process.env.NEXT_PUBLIC_GCP_FORM_SUBMIT_ENDPOINT,
  gcpApsisEndpoint: process.env.GATSBY_GCP_APSIS_ENDPOINT,
  isCountryCodeProhibited: convertStrToBool(
    process.env.NEXT_PUBLIC_DONT_USE_COUNTRY_CODE
  ),
  webtoolsCalculatorDataUrl: process.env.GATSBY_WEBTOOLS_CALCULATOR_DATA_URL,
  isWebToolsCalculatorEnabled: convertStrToBool(
    process.env.NEXT_PUBLIC_ENABLE_WEBTOOLS_CALCULATOR
  ),
  isV2WebToolsCalculatorEnabled: convertStrToBool(
    process.env.GATSBY_ENABLE_V2_WEBTOOLS_CALCULATOR
  ),
  webToolsCalculatorApsisEndpoint:
    process.env.GATSBY_WEBTOOLS_CALCULATOR_APSIS_ENDPOINT,
  documentDownloadMaxLimit:
    +process.env.GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT || 100,
  googleApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  esIndexNameSystem: process.env.GATSBY_ES_INDEX_NAME_SYSTEMS,
  esIndexNameProduct: process.env.NEXT_PUBLIC_ES_INDEX_NAME_PRODUCTS,
  esIndexNameTrainings: process.env.GATSBY_ES_INDEX_NAME_TRAININGS,
  isDevMode: process.env.NODE_ENV === "development",
  gcpSystemConfiguratorEndpoint:
    process.env.GATSBY_GCP_SYSTEM_CONFIGURATOR_ENDPOINT,
  isLegacyFiltersUsing: convertStrToBool(process.env.GATSBY_USE_LEGACY_FILTERS),
  isNextDisabledElasticSearch: convertStrToBool(
    process.env.NEXT_PUBLIC_DISABLE_SEARCH
  ),
  oneTrustId: process.env.GATSBY_ONETRUST_ID,
  isSampleOrderingEnabled: convertStrToBool(
    process.env.GATSBY_ENABLE_SAMPLE_ORDERING
  ),
  renderTeamCategoriesAsRows: convertStrToBool(
    process.env.GATSBY_TEAM_CATEGORIES_AS_ROWS
  ),
  enableProductClassificationAttributeOrdering: convertStrToBool(
    process.env.GATSBY_ENABLE_PRODUCT_CLASSIFICATION_ATTRIBUTE_ORDERING
  ),
  isLoginEnabled: convertStrToBool(process.env.NEXT_PUBLIC_IS_LOGIN_ENABLED),
  marketLocaleCode: process.env.GATSBY_MARKET_LOCALE_CODE,
  excludeLocalisedAlternate: convertStrToBool(
    process.env.GATSBY_EXCLUDE_LOCALISED_ALTERNATE
  ),
  countryName: process.env.GATSBY_COUNTRY_NAME
});

const ConfigContext = createContext<Config>({
  ...envConfig()
});

export const ConfigProvider = ({
  configOverride,
  children
}: {
  configOverride?: Partial<Config>;
  children: React.ReactNode;
}) => (
  <ConfigContext.Provider value={{ ...envConfig(), ...configOverride }}>
    {children}
  </ConfigContext.Provider>
);

export const useConfig = () => useContext(ConfigContext);
