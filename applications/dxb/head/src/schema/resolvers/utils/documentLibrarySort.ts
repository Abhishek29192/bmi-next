import { ContentfulAssetType, ContentfulDocument } from "../types/Contentful";
import { ProductDocument } from "../types/pim";

/**
 * This function assumes that the passed in documents have already been filtered
 * by the provided asset types, so that they will always have a matching asset type.
 *
 * @param documents list of documents _already filtered_ by the asset types provided
 * @param assetTypes list of asset types that are related to the documents
 * @returns the passed in documents sorted
 */
export const sortAllDocuments = (
  documents: (ContentfulDocument | ProductDocument)[],
  assetTypes: ContentfulAssetType[]
): (ContentfulDocument | ProductDocument)[] =>
  documents.concat().sort((a, b) => {
    const aAssetType = assetTypes.find((assetType) => {
      return assetType.id === a.assetType___NODE;
    });
    const bAssetType = assetTypes.find(
      (assetType) => assetType.id === b.assetType___NODE
    );
    if (aAssetType.name > bAssetType.name) {
      return 1;
    }
    if (aAssetType.name < bAssetType.name) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    if (a.title < b.title) {
      return -1;
    }
    return 0;
  });

export const sortCmsDocuments = (
  documents: ContentfulDocument[]
): ContentfulDocument[] => {
  const docs = documents.concat();
  const isAllDocsHaveBrand = docs.every((doc) => Boolean(doc.brand));

  if (isAllDocsHaveBrand) {
    return docs.sort((a, b) => {
      if (a.brand > b.brand) {
        return 1;
      }
      if (a.brand < b.brand) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      return 0;
    });
  } else {
    return docs.sort((a, b) => (a.title > b.title ? 1 : -1));
  }
};

export const sortPimDocuments = (
  documents: ProductDocument[]
): ProductDocument[] =>
  documents.concat().sort((a, b) => {
    if (a.assetType > b.assetType) {
      return 1;
    }
    if (a.assetType < b.assetType) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    if (a.title < b.title) {
      return -1;
    }
    return 0;
  });
