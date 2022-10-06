import path from "path";
import logger from "@bmi-digital/functions-logger";
import {
  EsPIMDocumentData,
  EsPIMLinkDocumentData
} from "@bmi/elasticsearch-types";
import {
  Asset,
  AssetTypeData,
  Product as PIMProduct,
  System
} from "@bmi/pim-types";
import { v4 } from "uuid";
import { getAssetTypes, getProductDocumentNameMap } from "./contentfulApi";
import { ProductDocumentNameMap } from "./types";
import {
  getCategoryFilters,
  getClassificationsFilters
} from "./utils/filterHelpers";

const MAX_SIZE_ALLOWED_BYTES = 41943040; // 40MB

const isPimLinkDocument = (asset: Asset) => {
  const { allowedToDownload, url, fileSize, realFileName } = asset;

  if (!allowedToDownload) {
    return true;
  }

  if (fileSize > MAX_SIZE_ALLOWED_BYTES) {
    return true;
  }

  return !fileSize && !realFileName && !!url;
};

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
  item: PIMProduct | System
): Promise<(EsPIMDocumentData | EsPIMLinkDocumentData)[] | undefined> => {
  const assetTypes: AssetTypeData[] | undefined = await getAssetTypes();
  const productDocumentNameMap: ProductDocumentNameMap | undefined =
    await getProductDocumentNameMap();

  if (assetTypes && productDocumentNameMap) {
    const esPimDocuments = (item.assets || [])
      .map((asset) => {
        const id = v4();
        const { fileSize, mime, url, realFileName, name } = asset;

        const assetType = assetTypes.find(
          (assetType) => assetType.pimCode === asset.assetType
        );

        if (!assetType || !url) {
          logger.info({
            message: `Document ${realFileName} doesn't have assetType or url, assetType is: ${asset.assetType}, name is: ${name}, url is: ${url}`
          });
          return;
        }

        const title = {
          "Product name + asset type": `${item.name} ${assetType.name}`,
          "Document name": name || `${item.name} ${assetType.name}`
        }[`${productDocumentNameMap}`];

        const categoryFilters = getCategoryFilters(item.categories || []);
        let classificationFilters = {};
        if ("variantOptions" in item) {
          classificationFilters = getClassificationsFilters(item);
        }

        if (isPimLinkDocument(asset)) {
          return {
            __typename: "PIMLinkDocument",
            id,
            url,
            title,
            isLinkDocument: true,
            productBaseCode: item.code,
            productName: item.name,
            noIndex: false,
            docName: name,
            assetType,
            ...categoryFilters,
            ...classificationFilters
          };
        }

        if (!fileSize || !realFileName) {
          logger.info({
            message: `Document ${realFileName} doesn't have fileSize or realFileName`
          });
          return;
        }

        return {
          __typename: "PIMDocument",
          productBaseCode: item.code,
          productName: item.name,
          noIndex: false,
          id,
          url,
          title,
          isLinkDocument: false,
          titleAndSize: `${name}_${fileSize}`,
          docName: name,
          assetType,
          fileSize,
          format: mime || getFormatFromFileName(realFileName),
          extension: path.extname(realFileName).substring(1),
          realFileName,
          ...categoryFilters,
          ...classificationFilters
        };
      })
      .filter(Boolean);

    logger.info({
      message: `Initial count of assets: ${item.assets?.length}, Count of indexed assets: ${esPimDocuments.length}`
    });

    return esPimDocuments as (EsPIMDocumentData | EsPIMLinkDocumentData)[];
  }
};
