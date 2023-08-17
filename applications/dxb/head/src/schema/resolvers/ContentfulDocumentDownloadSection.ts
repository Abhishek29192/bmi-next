import { ContentfulDocumentDownloadSection } from "./types/Contentful";
import type { Context, ResolveArgs } from "./types/Gatsby";

export default {
  documents: {
    type: "[ContentfulDocument]!",
    async resolve(
      source: ContentfulDocumentDownloadSection,
      _args: ResolveArgs,
      context: Context
    ) {
      const documentIds = source.documents___NODE;
      if (!documentIds.length) {
        return [];
      }

      const uniqueIds = documentIds.reduce<string[]>((acc, current) => {
        const duplicate = acc.includes(current);
        if (duplicate) {
          return acc;
        }

        return [...acc, current];
      }, []);

      const docs = await context.nodeModel.getNodesByIds({
        type: "ContentfulDocument",
        ids: uniqueIds
      });

      return docs || [];
    }
  }
};
