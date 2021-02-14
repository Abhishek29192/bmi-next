"use strict";

module.exports = {
  slug: {
    resolve() {
      return "/";
    }
  },
  brands: {
    type: ["ContentfulBrandLandingPage"],
    async resolve(source, args, context) {
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
