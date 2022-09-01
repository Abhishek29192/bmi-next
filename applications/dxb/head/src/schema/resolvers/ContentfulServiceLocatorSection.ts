import { Context, Node, ResolveArgs } from "./types/Gatsby";

export default {
  services: {
    type: ["ContentfulService"],
    async resolve(
      source: Node,
      args: ResolveArgs,
      context: Context
    ): Promise<Node[]> {
      const marketFilters = process.env.MARKET_TAG_NAME
        ? {
            metadata: {
              tags: {
                elemMatch: {
                  contentful_id: {
                    eq: process.env.MARKET_TAG_NAME
                  }
                }
              }
            }
          }
        : {};

      const { entries } = await context.nodeModel.findAll<Node>(
        {
          query: {
            filter: {
              entryType: { eq: source.type },
              node_locale: { eq: process.env.GATSBY_MARKET_LOCALE_CODE },
              ...marketFilters
            }
          },
          type: "ContentfulService"
        },
        { connectionType: "ContentfulService" }
      );
      const services = [...entries];
      if (!services || !services.length) {
        return [];
      }

      return services;
    }
  }
};
