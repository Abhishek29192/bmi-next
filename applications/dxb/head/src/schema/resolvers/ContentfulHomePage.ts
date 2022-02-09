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
      return context.nodeModel.getAllNodes(
        { type: "ContentfulBrandLandingPage" },
        { connectionType: "ContentfulBrandLandingPage" }
      );

      // TODO: In theory the following approach is better. However, we couldn't
      // find a way to link a relationship from the referenced entry

      // const brands = await context.nodeModel.runQuery({
      //   query: {
      //     filter: {
      //       site: { elemMatch: { id: { in: source.site___NODE || [] } } }
      //     }
      //   },
      //   type: "ContentfulBrandLandingPage"
      // });

      // return brands || [];
    }
  }
};
