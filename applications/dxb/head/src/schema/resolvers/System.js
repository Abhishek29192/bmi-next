"use strict";

module.exports = {
  relatedProducts: {
    type: ["Products"],
    async resolve(source, args, context) {
      console.log(source);
      console.log(args);
      console.log(context);
      return await context.nodeModel.runQuery({
        query: {
          filter: {
            code: { in: source.products.map((product) => product.code) }
          }
        },
        type: "Products"
      });
    }
  }
};
