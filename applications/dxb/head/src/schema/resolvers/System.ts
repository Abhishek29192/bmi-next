import { Product, System } from "@bmi/firestore-types";
import { AssetType } from "../../types/pim";
import { generateSystemPath } from "../../utils/systems";
import { Context, Node, ResolveArgs } from "./types/Gatsby";

const createResolver = (field: keyof Node) => ({
  type: ["Product"],
  async resolve(source: Node, args: ResolveArgs, context: Context) {
    // eslint-disable-next-line security/detect-object-injection
    const sourceField = source[field] as { code: string }[];

    if (!sourceField) {
      return [];
    }

    const variantCodes = sourceField.map((code) => code);

    const { entries } = await context.nodeModel.findAll<Product>({
      query: {
        filter: {
          code: { in: variantCodes }
        }
      },
      type: "Product"
    });

    const products = [...entries];

    // fix for JIRA: https://bmigroup.atlassian.net/browse/DXB-3733
    // ONLY log and return empty if NO products were found for ANY variant codes
    if (variantCodes.length > 0 && products.length === 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `Couldn't find ${field} that match ${JSON.stringify(
          variantCodes,
          null,
          2
        )}\n`
      );
      return [];
    }

    return products;
  }
});

export default {
  // Could be done in firestore writer, but requires a list of valid AssetTypes from Contentful
  documents: {
    async resolve(source: System, args: ResolveArgs, context: Context) {
      if (!source.documents || !source.documents.length) {
        return [];
      }
      const { entries } = await context.nodeModel.findAll<AssetType>(
        {
          query: {},
          type: "ContentfulAssetType"
        },
        { connectionType: "ContentfulAssetType" }
      );

      const assetTypes = [...entries]
        .filter(
          (assetType) =>
            !["BIM", "FIXING_TOOL", "SPECIFICATION", "VIDEO"].find(
              (pimCode) => pimCode === assetType.pimCode
            )
        )
        .map((assetType) => assetType.pimCode);

      return source.documents.filter((document) =>
        assetTypes.some((assetType) => assetType === document.assetType)
      );
    }
  },
  path: {
    async resolve(source: Partial<Node>) {
      return generateSystemPath(source as any);
    }
  },
  relatedOptionalProducts: createResolver("relatedOptionalProducts"),
  relatedProducts: createResolver("relatedProducts"),
  relatedSystems: {
    type: ["System"],
    async resolve(source: System, args: ResolveArgs, context: Context) {
      if (!source.systemReferences || !source.systemReferences.length) {
        return [];
      }
      const { entries } = await context.nodeModel.findAll<System>({
        query: {
          filter: {
            code: { in: source.systemReferences }
          }
        },
        type: "System"
      });

      return [...entries]
        .reduce<System[]>((systems, system) => {
          systems.find((sys) => sys.name === system.name) ||
            systems.push(system);
          return systems;
        }, [])
        .sort((a, b) => {
          const weightA = a.scoringWeight;
          const weightB = b.scoringWeight;
          if (weightB === weightA) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
          }

          return weightB - weightA;
        });
    }
  }
};
