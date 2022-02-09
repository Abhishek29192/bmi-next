import { generateSystemPath } from "../../utils/systems";
import { Context, Node, ResolveArgs } from "./types";

const systemPathResolver = {
  async resolve(source: Partial<Node>) {
    return generateSystemPath(source);
  }
};

const createResolver = (field: keyof Node) => ({
  type: ["Products"],
  async resolve(source: Node, args: ResolveArgs, context: Context) {
    // eslint-disable-next-line security/detect-object-injection
    const sourceField = source[field] as { code: string }[];

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
              code: { in: variantCodes }
            }
          },
          approvalStatus: { eq: "approved" }
        }
      },
      type: "Products"
    });

    if (products.length !== variantCodes.length) {
      // eslint-disable-next-line no-console
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

export default {
  path: systemPathResolver,
  relatedProducts: createResolver("products"),
  relatedOptionalProducts: createResolver("optionalProducts")
};
