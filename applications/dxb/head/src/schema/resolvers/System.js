"use strict";

function createResolver(field) {
  return {
    type: ["Products"],
    async resolve(source, args, context) {
      // eslint-disable-next-line security/detect-object-injection
      const sourceField = source[field];

      if (!sourceField) return [];

      const products = await context.nodeModel.runQuery({
        query: {
          filter: {
            // eslint-disable-next-line security/detect-object-injection
            code: { in: sourceField.map((product) => product.code) },
            approvalStatus: { eq: "approved" }
          }
        },
        type: "Products"
      });

      if (products.length !== sourceField.length) {
        console.warn(`Couldn't find ${field} that match ${sourceField}`);
      }

      return products;
    }
  };
}

module.exports = {
  relatedProducts: createResolver("products"),
  relatedOptionalProducts: createResolver("optionalProducts")
};
