import { testPluginOptionsSchema } from "gatsby-plugin-utils";
import { pluginOptionsSchema } from "../gatsby-node";

describe("pluginOptionsSchema", () => {
  const defaultOptions = {
    ids: ["YOUR_GOOGLE_TAGMANAGER_ID"],
    includeInDevelopment: false,
    defaultDataLayer: {
      type: "object",
      value: { platform: "gatsby", env: "production" }
    },
    gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
    gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
    dataLayerName: "YOUR_DATA_LAYER_NAME",
    routeChangeEventName: "YOUR_ROUTE_CHANGE_EVENT_NAME",
    enableWebVitalsTracking: true,
    selfHostedOrigin: "YOUR_SELF_HOSTED_ORIGIN"
  };

  it("should validate valid options", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      defaultOptions
    );

    expect(isValid).toEqual(true);
    expect(errors).toEqual([]);
  });

  it("should require ids", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      {
        ...defaultOptions,
        ids: undefined
      }
    );

    expect(isValid).toEqual(false);
    expect(errors).toEqual(['"ids" is required']);
  });

  it("should require defaultDataLayer", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      {
        ...defaultOptions,
        defaultDataLayer: undefined
      }
    );

    expect(isValid).toEqual(false);
    expect(errors).toEqual(['"defaultDataLayer" is required']);
  });
});
