"use strict";

const { generateSystemPath } = require("../../utils/systems");

const systemPathResolver = {
  async resolve(source) {
    return generateSystemPath(source);
  }
};

const createResolver = (field) => ({
  type: ["Products"],
  async resolve(source, args, context) {
    // eslint-disable-next-line security/detect-object-injection
    const sourceField = source[field];

    if (!sourceField) {
      return [];
    }

    const variantCodes = sourceField.map(
      (productVariant) => productVariant.code
    );

    const products = await context.nodeModel.runQuery({
      query: {
        filter: {
          variantOptions: {
            elemMatch: {
              // eslint-disable-next-line security/detect-object-injection
              code: { in: variantCodes }
            }
          },
          approvalStatus: { eq: "approved" }
        }
      },
      type: "Products"
    });

    if (products.length !== variantCodes.length) {
      console.warn(
        `Couldn't find ${field} that match ${JSON.stringify(
          variantCodes,
          null,
          2
        )}\n`
      );
    }

    return products;
  }
});

module.exports = {
  path: systemPathResolver,
  relatedProducts: createResolver("products"),
  relatedOptionalProducts: createResolver("optionalProducts")
};
