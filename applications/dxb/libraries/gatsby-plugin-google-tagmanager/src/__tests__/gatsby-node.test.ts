import { testPluginOptionsSchema } from "gatsby-plugin-utils";
import { pluginOptionsSchema } from "../gatsby-node";

describe("pluginOptionsSchema", () => {
  it("should validate valid options", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      {
        ids: ["YOUR_GOOGLE_TAGMANAGER_ID"],
        includeInDevelopment: false,
        defaultDataLayer: { platform: "gatsby" },
        gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
        gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
        dataLayerName: "YOUR_DATA_LAYER_NAME",
        routeChangeEventName: "YOUR_ROUTE_CHANGE_EVENT_NAME",
        enableWebVitalsTracking: true,
        selfHostedOrigin: "YOUR_SELF_HOSTED_ORIGIN"
      }
    );

    expect(isValid).toEqual(true);
    expect(errors).toEqual([]);
  });

  it("should require ids", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      {
        ids: undefined
      }
    );

    expect(isValid).toEqual(false);
    expect(errors).toEqual(['"ids" is required']);
  });

  it("should support defaultDataLayer as a function", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      {
        ids: ["YOUR_GOOGLE_TAGMANAGER_ID"],
        defaultDataLayer: () => {
          return {
            originalLocation:
              document.location.protocol +
              "//" +
              document.location.hostname +
              document.location.pathname +
              document.location.search
          };
        }
      }
    );

    expect(isValid).toEqual(true);
    expect(errors).toEqual([]);
  });
});
