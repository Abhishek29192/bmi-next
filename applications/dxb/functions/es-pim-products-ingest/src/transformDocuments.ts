import path from "path";
import logger from "@bmi-digital/functions-logger";
import { isDefined } from "@bmi/utils";
import { v4 as uuid } from "uuid";
import type {
  PimDocumentBase,
  PimProductDocument,
  PimSystemDocument
} from "@bmi/elasticsearch-types";
import type {
  Asset,
  Product as PIMProduct,
  System,
  VariantOption
} from "@bmi/pim-types";
import { getAssetTypes, getProductDocumentNameMap } from "./contentfulApi";
import {
  getCategoryFilters,
  getClassificationsFilters
} from "./utils/filterHelpers";
import type { ContentfulAssetType, ProductDocumentNameMap } from "./types";

const MAX_SIZE_ALLOWED_BYTES = 41943040; // 40MB

const isPimLinkDocument = (asset: Asset) =>
  !asset.allowedToDownload ||
  asset.fileSize === 0 ||
  asset.fileSize > MAX_SIZE_ALLOWED_BYTES ||
  !asset.realFileName;

const mapExtensionToFormat = {
  pdf: "application/pdf",
  jpg: "image/jpg",
  jpeg: "image/jpeg",
  png: "image/png"
};

const getFormatFromFileName = (filename: string): string =>
  mapExtensionToFormat[
    path.extname(filename).substring(1) as keyof typeof mapExtensionToFormat
  ];

export const transformDocuments = async (
  item: PIMProduct | System,
  locale: string,
  tag?: string
): Promise<(PimProductDocument | PimSystemDocument)[]> => {
  const assetTypes = await getAssetTypes(locale, tag);
  const isSystemItem = isSystem(item);

  if (assetTypes.length === 0) {
    return [];
  }

  if (
    item.approvalStatus !== "approved" &&
    item.approvalStatus !== "discontinued"
  ) {
    return [];
  }

  const productDocumentNameMap = await getProductDocumentNameMap(locale, tag);

  const categoryFilters = item.categories
    ? getCategoryFilters(item.categories)
    : {};

  if (isSystemItem) {
    const systemDocuments = (item.assets || [])
      .map((asset) => {
        const doc = getDocument(
          asset,
          item,
          assetTypes,
          productDocumentNameMap
        );

        if (!doc) {
          return;
        }

        const systemDoc: PimSystemDocument = {
          ...doc,
          __typename: "PIMSystemDocument",
          ...categoryFilters
        };
        return systemDoc;
      })
      .filter(isDefined);

    logger.info({
      message: `Initial count of assets: ${item.assets?.length}, Count of indexed assets: ${systemDocuments.length}`
    });
    return systemDocuments;
  }

  const variantDocuments = (item.variantOptions || []).flatMap((variant) => {
    const classificationFilters = getClassificationsFilters(
      item.classifications,
      variant.classifications
    );
    return (variant.assets || item.assets || [])
      .map((asset) => {
        const doc = getDocument(
          asset,
          item,
          assetTypes,
          productDocumentNameMap
        );

        if (!doc) {
          return;
        }

        const productDocument: PimProductDocument = {
          ...doc,
          __typename: "PIMDocument",
          productName: (variant.name || item.name)!,
          productBaseCode: item.code,
          ...categoryFilters,
          ...classificationFilters
        };

        return productDocument;
      })
      .filter(isDefined);
  });

  const assetsCounter = (item.variantOptions || []).reduce((acc, variant) => {
    if (variant.assets) {
      return acc + variant.assets.length;
    }
    return acc;
  }, item.assets?.length || 0);

  logger.info({
    message: `Initial count of assets: ${assetsCounter}, Count of indexed assets: ${variantDocuments.length}`
  });

  return variantDocuments;
};

const getDocument = (
  asset: Asset,
  item: PIMProduct | System | VariantOption,
  assetTypes: ContentfulAssetType[],
  productDocumentNameMap: ProductDocumentNameMap
): PimDocumentBase | undefined => {
  const assetType = assetTypes.find(
    (assetType) => assetType.pimCode === asset.assetType
  );

  if (!assetType || !asset.url || !isDefined(asset.fileSize)) {
    logger.info({
      message: `Document ${asset.name} doesn't have assetType or url or fileSize, assetType is: ${asset.assetType}, url is: ${asset.url}, fileSize is: ${asset.fileSize}`
    });
    return;
  }

  const title = {
    "Product name + asset type": `${item.name} ${assetType.name}`,
    "Document name": asset.name || `${item.name} ${assetType.name}`
  }[`${productDocumentNameMap}`];
  const id = uuid();

  return {
    id,
    title,
    approvalStatus: item.approvalStatus,
    url: asset.url,
    assetType: {
      name: assetType.name,
      pimCode: assetType.pimCode,
      code: assetType.code
    },
    isLinkDocument: isPimLinkDocument(asset),

    noIndex: false,
    fileSize: asset.fileSize,
    format: asset.mime || getFormatFromFileName(asset.realFileName!),
    extension: asset.realFileName
      ? path.extname(asset.realFileName).substring(1)
      : "",
    realFileName: asset.realFileName || "",
    titleAndSize: `${asset.name}_${asset.fileSize}`,
    validUntil: asset.validUntil
      ? new Date(asset.validUntil).getTime()
      : undefined
  };
};

const isSystem = (item: System | PIMProduct): item is System => {
  return !("variantOptions" in item);
};
