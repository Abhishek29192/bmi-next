import { Context, Node, ResolveArgs } from "./types/Gatsby";

export default {
  slug: {
    resolve() {
      return "/";
    }
  },
  path: {
    resolve() {
      return "/";
    }
  },
  brands: {
    type: "[ContentfulBrandLandingPage]!",
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
          query: { filter: marketFilters },
          type: "ContentfulBrandLandingPage"
        },
        { connectionType: "ContentfulBrandLandingPage" }
      );
      return [...entries];
    }
  }
};
