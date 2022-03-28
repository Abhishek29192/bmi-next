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
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      return await context.nodeModel.getAllNodes(
        { type: "ContentfulBrandLandingPage" },
        { connectionType: "ContentfulBrandLandingPage" }
      );
    }
  }
};
