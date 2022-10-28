import { ContentfulClientApi, createClient } from "contentful";

const { CONTENTFUL_DELIVERY_TOKEN, CONTENTFUL_ENVIRONMENT, SPACE_ID } =
  process.env;

let contentfulClientCache: ContentfulClientApi;

export const getContentfulClient = () => {
  if (!contentfulClientCache) {
    if (!SPACE_ID) {
      throw Error("SPACE_ID was not provided");
    }

    if (!CONTENTFUL_ENVIRONMENT) {
      throw Error("CONTENTFUL_ENVIRONMENT was not provided");
    }

    if (!CONTENTFUL_DELIVERY_TOKEN) {
      throw Error("CONTENTFUL_DELIVERY_TOKEN was not provided");
    }

    contentfulClientCache = createClient({
      space: process.env.SPACE_ID!,
      environment: process.env.CONTENTFUL_ENVIRONMENT!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!
    });

    return contentfulClientCache;
  }
  return contentfulClientCache;
};
