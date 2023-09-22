import type { GatsbyNode } from "gatsby";
import type { Options } from "./types";

export const onPreInit: GatsbyNode["onPreInit"] = (
  args,
  options: Omit<Options, "defaultDataLayer"> & {
    // eslint-disable-next-line @typescript-eslint/ban-types
    defaultDataLayer?: object | Function;
  }
) => {
  if (!options.defaultDataLayer) {
    return;
  }

  if (typeof options.defaultDataLayer === "function") {
    options.defaultDataLayer = {
      type: "function",
      value: options.defaultDataLayer.toString()
    };
  } else {
    options.defaultDataLayer = {
      type: "object",
      value: options.defaultDataLayer
    };
  }
};

export const pluginOptionsSchema: NonNullable<
  GatsbyNode["pluginOptionsSchema"]
> = ({ Joi }) =>
  Joi.object({
    ids: Joi.array()
      .items(Joi.string())
      .description(
        "Google Tag Manager IDs that can be found in your Tag Manager dashboard."
      )
      .required(),
    includeInDevelopment: Joi.boolean()
      .default(false)
      .description(
        "Include Google Tag Manager when running in development mode."
      ),
    defaultDataLayer: Joi.alternatives()
      .try(Joi.object(), Joi.function())
      .description(
        "Data layer to be set before Google Tag Manager is loaded. Should be an object or a function."
      ),
    gtmAuth: Joi.string().description(
      "Google Tag Manager environment auth string."
    ),
    gtmPreview: Joi.string().description(
      "Google Tag Manager environment preview name."
    ),
    dataLayerName: Joi.string().description("Data layer name."),
    routeChangeEventName: Joi.string()
      .default("gatsby-route-change")
      .description(
        "Name of the event that is triggered on every Gatsby route change."
      ),
    enableWebVitalsTracking: Joi.boolean().default(false),
    selfHostedOrigin: Joi.string()
      .default("https://www.googletagmanager.com")
      .description("The origin where GTM is hosted.")
  });
