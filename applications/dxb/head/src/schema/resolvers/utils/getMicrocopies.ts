import type { ContentfulSite, MicroCopyNode } from "../types/Contentful";
import type { Context, Node } from "../types/Gatsby";

export const getMicroCopies = async (
  context: Context
): Promise<MicroCopyNode[] | undefined> => {
  const marketCode = process.env.GATSBY_SPACE_MARKET_CODE;
  const localeCode = process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE;

  if (!marketCode || !localeCode) {
    console.error(
      `Please check environment variables 'GATSBY_SPACE_MARKET_CODE' or 'NEXT_PUBLIC_MARKET_LOCALE_CODE' not set!`
    );
    return;
  }
  const site = await context.nodeModel.findOne<ContentfulSite>(
    {
      query: {
        filter: {
          countryCode: { eq: marketCode },
          node_locale: { eq: localeCode }
        }
      },
      type: "ContentfulSite"
    },
    { connectionType: "ContentfulSite" }
  );
  if (!site) {
    console.error(
      `Site not found in contentful: for country code: '${marketCode}' and locale: '${localeCode}'.`
    );
    return;
  }
  const resource = await context.nodeModel.getNodeById<Node>({
    id: site.resources___NODE,
    type: "ContentfulResources"
  });
  if (!resource) {
    console.error(
      `Resource not found: for site in contentful with id: '${site.contentful_id}'.`
    );
    return;
  }

  // MC access in consistently happens only via resource content type
  // that means a market is only aware of MCs which are associated with the resource
  return context.nodeModel.getNodesByIds<MicroCopyNode>({
    ids: resource.microCopy___NODE,
    type: "ContentfulMicroCopy"
  });
};
