import { Context, Node, ResolveArgs } from "./types";

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
    type: ["ContentfulBrandLandingPage"],
    async resolve(
      source: Node,
      args: ResolveArgs,
      context: Context
    ): Promise<Node[]> {
      const { entries } = await context.nodeModel.findAll<Node>(
        { query: {}, type: "ContentfulBrandLandingPage" },
        { connectionType: "ContentfulBrandLandingPage" }
      );
      return [...entries];
    }
  }
};
