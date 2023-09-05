import { ClientAPI, createClient } from "contentful-management";

let contentfulClientCache: ClientAPI;

export const getContentfulClient = (): ClientAPI => {
  if (!contentfulClientCache) {
    if (!process.env.MANAGEMENT_ACCESS_TOKEN) {
      throw Error("MANAGEMENT_ACCESS_TOKEN was not provided");
    }

    contentfulClientCache = createClient({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
    });

    return contentfulClientCache;
  }
  return contentfulClientCache;
};
