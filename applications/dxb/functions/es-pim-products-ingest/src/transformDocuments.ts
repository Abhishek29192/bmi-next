import path from "path";
import logger from "@bmi-digital/functions-logger";
import {
  PimProductDocument,
  PimSystemDocument
} from "@bmi/elasticsearch-types";
import { Asset, Product as PIMProduct, System } from "@bmi/pim-types";
import { isDefined } from "@bmi/utils";
import { v4 as uuid } from "uuid";
import { getAssetTypes, getProductDocumentNameMap } from "./contentfulApi";
import {
  getCategoryFilters,
  getClassificationsFilters
} from "./utils/filterHelpers";

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

  if (assetTypes.length === 0) {
    return [];
  }

  const productDocumentNameMap = await getProductDocumentNameMap(locale, tag);

  const esPimDocuments: (PimProductDocument | PimSystemDocument)[] = (
    item.assets || []
  )
    .map((asset) => {
      const id = uuid();
      const assetType = assetTypes.find(
        (assetType) => assetType.pimCode === asset.assetType
      );

      if (!assetType || !asset.url || !isDefined(asset.fileSize)) {
        logger.info({
          message: `Document ${asset.name} doesn't have assetType or url or fileSize, assetType is: ${asset.assetType}, url is: ${asset.url}, fileSize is: ${asset.fileSize}`
        });
        return;
      }

      const categoryFilters = item.categories
        ? getCategoryFilters(item.categories)
        : {};
      const classificationFilters =
        "variantOptions" in item && item.classifications
          ? getClassificationsFilters(item)
          : {};

      const title = {
        "Product name + asset type": `${item.name} ${assetType.name}`,
        "Document name": asset.name || `${item.name} ${assetType.name}`
      }[`${productDocumentNameMap}`];

      const objToReturn = {
        __typename:
          "variantOptions" in item ? "PIMDocument" : "PIMSystemDocument",
        id,
        title,
        url: asset.url,
        assetType,
        isLinkDocument: isPimLinkDocument(asset),

        noIndex: false,
        fileSize: asset.fileSize,
        format: asset.mime || getFormatFromFileName(asset.realFileName!),
        extension: asset.realFileName
          ? path.extname(asset.realFileName!).substring(1)
          : "",
        realFileName: asset.realFileName ? asset.realFileName : "",
        titleAndSize: `${asset.name}_${asset.fileSize}`,
        ...categoryFilters,
        ...classificationFilters
      };

      // TODO: may be change this to identify between system and product
      // with type check or something
      if ("variantOptions" in item) {
        return {
          ...objToReturn,
          productBaseCode: item.code,
          productName: item.name
        } as PimProductDocument;
      } else {
        return objToReturn as PimSystemDocument;
      }
    })
    .filter(isDefined);

  logger.info({
    message: `Initial count of assets: ${item.assets?.length}, Count of indexed assets: ${esPimDocuments.length}`
  });

  return esPimDocuments;
};
