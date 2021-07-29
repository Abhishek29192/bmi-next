"use strict";

module.exports = {
  relatedProducts: {
    type: ["Products"],
    async resolve(source, args, context) {
      const products = await context.nodeModel.runQuery({
        query: {
          filter: {
            code: { in: source.products.map((product) => product.code) },
            approvalStatus: { eq: "Approved" }
          }
        },
        type: "Products"
      });

      if (products.length !== source.products.length) {
        console.warn(`Couldn't find products that match ${source.products}`);
      }

      return products;
    }
  }
};
