import type { GatsbyNode } from "gatsby";

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
    defaultDataLayer: Joi.object()
      .description(
        "Data layer to be set before Google Tag Manager is loaded. Should be an object."
      )
      .required(),
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
