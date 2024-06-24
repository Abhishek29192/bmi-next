import { render, screen } from "@testing-library/react";
import { ConfigProvider, useConfig } from "../ConfigProvider";

const TestComponent = () => {
  const config = useConfig();
  return (
    <>
      {Object.entries(config).map(([key, value]) => (
        <div key={key} data-testid={key}>
          {`${value}`}
        </div>
      ))}
    </>
  );
};

describe("ConfigProvider", () => {
  describe.each([
    { key: "isPreviewMode", env: "GATSBY_PREVIEW" },
    {
      key: "isSchemaORGActivated",
      env: "GATSBY_SCHEMA_ORG_ACTIVATED"
    },
    {
      key: "isBrandProviderEnabled",
      env: "GATSBY_ENABLE_BRAND_PROVIDER"
    },
    {
      key: "isV2VisualiserEnabled",
      env: "GATSBY_ENABLE_V2_WEBTOOLS_VISUALISATOR"
    },
    {
      key: "isCountryCodeProhibited",
      env: "GATSBY_DONT_USE_COUNTRY_CODE"
    },
    {
      key: "isWebToolsCalculatorEnabled",
      env: "GATSBY_ENABLE_WEBTOOLS_CALCULATOR"
    },
    {
      key: "isV2WebToolsCalculatorEnabled",
      env: "GATSBY_ENABLE_V2_WEBTOOLS_CALCULATOR"
    },
    {
      key: "isLegacyFiltersUsing",
      env: "GATSBY_USE_LEGACY_FILTERS"
    },
    {
      key: "isGatsbyDisabledElasticSearch",
      env: "GATSBY_DISABLE_SEARCH"
    },
    { key: "isSampleOrderingEnabled", env: "GATSBY_ENABLE_SAMPLE_ORDERING" },
    {
      key: "renderTeamCategoriesAsRows",
      env: "GATSBY_TEAM_CATEGORIES_AS_ROWS"
    },
    {
      key: "enableProductClassificationAttributeOrdering",
      env: "GATSBY_ENABLE_PRODUCT_CLASSIFICATION_ATTRIBUTE_ORDERING"
    },
    { key: "isLoginEnabled", env: "GATSBY_IS_LOGIN_ENABLED" },
    {
      key: "excludeLocalisedAlternate",
      env: "GATSBY_EXCLUDE_LOCALISED_ALTERNATE"
    }
  ])("Boolean config - $key", ({ key, env }) => {
    it(`should be set to false if ${env} is undefined`, () => {
      // eslint-disable-next-line security/detect-object-injection
      const originalEnvValue = process.env[env];
      // eslint-disable-next-line security/detect-object-injection
      delete process.env[env];

      render(
        <ConfigProvider>
          <TestComponent />
        </ConfigProvider>
      );

      expect(screen.getByTestId(key)).toHaveTextContent("false");

      // eslint-disable-next-line security/detect-object-injection
      process.env[env] = originalEnvValue;
    });

    it(`should be set to false if ${env} is invalid`, () => {
      // eslint-disable-next-line security/detect-object-injection
      const originalEnvValue = process.env[env];
      // eslint-disable-next-line security/detect-object-injection
      process.env[env] = "not-a-boolean";

      render(
        <ConfigProvider>
          <TestComponent />
        </ConfigProvider>
      );

      expect(screen.getByTestId(key)).toHaveTextContent("false");

      // eslint-disable-next-line security/detect-object-injection
      process.env[env] = originalEnvValue;
    });

    it(`should be set to false if ${env} is false`, () => {
      // eslint-disable-next-line security/detect-object-injection
      const originalEnvValue = process.env[env];
      // eslint-disable-next-line security/detect-object-injection
      process.env[env] = "false";

      render(
        <ConfigProvider>
          <TestComponent />
        </ConfigProvider>
      );

      expect(screen.getByTestId(key)).toHaveTextContent("false");

      // eslint-disable-next-line security/detect-object-injection
      process.env[env] = originalEnvValue;
    });

    it(`should be set to true if ${env} is true`, () => {
      // eslint-disable-next-line security/detect-object-injection
      const originalEnvValue = process.env[env];
      // eslint-disable-next-line security/detect-object-injection
      process.env[env] = "true";

      render(
        <ConfigProvider>
          <TestComponent />
        </ConfigProvider>
      );

      expect(screen.getByTestId(key)).toHaveTextContent("true");

      // eslint-disable-next-line security/detect-object-injection
      process.env[env] = originalEnvValue;
    });

    it(`should be set to false if ${env} is true but passed in config is false`, () => {
      // eslint-disable-next-line security/detect-object-injection
      const originalEnvValue = process.env[env];
      // eslint-disable-next-line security/detect-object-injection
      process.env[env] = "true";

      render(
        <ConfigProvider configOverride={{ [key]: false }}>
          <TestComponent />
        </ConfigProvider>
      );

      expect(screen.getByTestId(key)).toHaveTextContent("false");

      // eslint-disable-next-line security/detect-object-injection
      process.env[env] = originalEnvValue;
    });

    it(`should be set to true if ${env} is false but passed in config is true`, () => {
      // eslint-disable-next-line security/detect-object-injection
      const originalEnvValue = process.env[env];
      // eslint-disable-next-line security/detect-object-injection
      process.env[env] = "false";

      render(
        <ConfigProvider configOverride={{ [key]: true }}>
          <TestComponent />
        </ConfigProvider>
      );

      expect(screen.getByTestId(key)).toHaveTextContent("true");

      // eslint-disable-next-line security/detect-object-injection
      process.env[env] = originalEnvValue;
    });
  });

  describe.each([
    { key: "googleTagManagerID", env: "GOOGLE_TAGMANAGER_ID" },
    { key: "hubSpotId", env: "GATSBY_HUBSPOT_ID" },
    { key: "gatsbyReCaptchaKey", env: "GATSBY_RECAPTCHA_KEY" },
    { key: "gatsbyReCaptchaNet", env: "GATSBY_RECAPTCHA_NET" },
    {
      key: "visualizerAssetUrl",
      env: "GATSBY_VISUALISER_ASSETS_URL"
    },
    {
      key: "documentDownloadEndpoint",
      env: "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT"
    },
    {
      key: "gcpFormUploadEndpoint",
      env: "GATSBY_GCP_FORM_UPLOAD_ENDPOINT"
    },
    {
      key: "gcpFormSubmitEndpoint",
      env: "GATSBY_GCP_FORM_SUBMIT_ENDPOINT"
    },
    { key: "gcpApsisEndpoint", env: "GATSBY_GCP_APSIS_ENDPOINT" },
    {
      key: "webtoolsCalculatorDataUrl",
      env: "GATSBY_WEBTOOLS_CALCULATOR_DATA_URL"
    },
    {
      key: "webToolsCalculatorApsisEndpoint",
      env: "GATSBY_WEBTOOLS_CALCULATOR_APSIS_ENDPOINT"
    },
    {
      key: "documentDownloadMaxLimit",
      env: "GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT",
      defaultValue: 100,
      invalidValue: "not-a-number",
      customValue: 50
    },
    { key: "googleApiKey", env: "GATSBY_GOOGLE_API_KEY" },
    {
      key: "esIndexNameSystem",
      env: "GATSBY_ES_INDEX_NAME_SYSTEMS"
    },
    {
      key: "esIndexNameProduct",
      env: "GATSBY_ES_INDEX_NAME_PRODUCTS"
    },
    {
      key: "gcpSystemConfiguratorEndpoint",
      env: "GATSBY_GCP_SYSTEM_CONFIGURATOR_ENDPOINT"
    },
    { key: "oneTrustId", env: "GATSBY_ONETRUST_ID" }
  ])(
    "String config - $key",
    ({ key, env, defaultValue, invalidValue, customValue }) => {
      it(`should be set to $defaultValue if ${env} is undefined`, () => {
        // eslint-disable-next-line security/detect-object-injection
        const originalEnvValue = process.env[env];
        // eslint-disable-next-line security/detect-object-injection
        delete process.env[env];

        render(
          <ConfigProvider>
            <TestComponent />
          </ConfigProvider>
        );

        expect(screen.getByTestId(key)).toHaveTextContent(`${defaultValue}`);

        // eslint-disable-next-line security/detect-object-injection
        process.env[env] = originalEnvValue;
      });

      it(`should be set to $defaultValue if ${env} is invalid`, () => {
        // eslint-disable-next-line security/detect-object-injection
        const originalEnvValue = process.env[env];
        // eslint-disable-next-line security/detect-object-injection
        process.env[env] = `${invalidValue}`;

        render(
          <ConfigProvider>
            <TestComponent />
          </ConfigProvider>
        );

        expect(screen.getByTestId(key)).toHaveTextContent(`${defaultValue}`);

        // eslint-disable-next-line security/detect-object-injection
        process.env[env] = originalEnvValue;
      });

      it(`should be set to ${env} value`, () => {
        // eslint-disable-next-line security/detect-object-injection
        const originalEnvValue = process.env[env];
        // eslint-disable-next-line security/detect-object-injection
        process.env[env] = `${customValue || "custom-value"}`;

        render(
          <ConfigProvider>
            <TestComponent />
          </ConfigProvider>
        );

        expect(screen.getByTestId(key)).toHaveTextContent(
          `${customValue || "custom-value"}`
        );

        // eslint-disable-next-line security/detect-object-injection
        process.env[env] = originalEnvValue;
      });

      it(`should be set to override value if ${env} is set but passed in config is also set`, () => {
        // eslint-disable-next-line security/detect-object-injection
        const originalEnvValue = process.env[env];
        // eslint-disable-next-line security/detect-object-injection
        process.env[env] = "custom-value";

        render(
          <ConfigProvider configOverride={{ [key]: "custom-override" }}>
            <TestComponent />
          </ConfigProvider>
        );

        expect(screen.getByTestId(key)).toHaveTextContent("custom-override");

        // eslint-disable-next-line security/detect-object-injection
        process.env[env] = originalEnvValue;
      });
    }
  );

  describe("isDevMode", () => {
    it("should be set to false if NODE_ENV is not set", () => {
      const originalEnvValue = process.env.NODE_ENV;
      delete process.env.NODE_ENV;

      render(
        <ConfigProvider>
          <TestComponent />
        </ConfigProvider>
      );

      expect(screen.getByTestId("isDevMode")).toHaveTextContent("false");

      // eslint-disable-next-line security/detect-object-injection
      process.env.NODE_ENV = originalEnvValue;
    });

    it("should be set to false if NODE_ENV is not set to DEVELOPMENT", () => {
      const originalEnvValue = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      render(
        <ConfigProvider>
          <TestComponent />
        </ConfigProvider>
      );

      expect(screen.getByTestId("isDevMode")).toHaveTextContent("false");

      // eslint-disable-next-line security/detect-object-injection
      process.env.NODE_ENV = originalEnvValue;
    });

    it("should be set to true if NODE_ENV is set to DEVELOPMENT", () => {
      const originalEnvValue = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      render(
        <ConfigProvider>
          <TestComponent />
        </ConfigProvider>
      );

      expect(screen.getByTestId("isDevMode")).toHaveTextContent("true");

      // eslint-disable-next-line security/detect-object-injection
      process.env.NODE_ENV = originalEnvValue;
    });
  });
});
