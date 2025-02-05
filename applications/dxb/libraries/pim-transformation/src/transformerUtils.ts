import path from "path";
import {
  Asset,
  AwardAndCertificateAssetType,
  BIM,
  Brand,
  Category,
  Classification,
  Document,
  FeatureCode,
  GuaranteesAndWarrantiesAssetType,
  Image
} from "@bmi/firestore-types";
import {
  Asset as PimAsset,
  Category as PimCategory,
  Classification as PimClassification,
  ClassificationWithFeatures,
  Image as PimImage,
  ImageAssetType,
  Mime
} from "@bmi/pim-types";
import { generateHashFromString, isDefined } from "@bmi/utils";
import { ImageFormat } from "@bmi/pim-types/src/types.js";

export const filterClassifications = (
  mergedClassifications: readonly PimClassification[],
  ignorableClassifications: readonly FeatureCode[]
): ClassificationWithFeatures[] =>
  mergedClassifications
    .map((classification) => ({
      ...classification,
      features: classification.features?.filter(
        (feature) =>
          !ignorableClassifications.some(
            (ignorableFeature) =>
              // TODO: Remove upercase checks - DXB-3449
              ignorableFeature.toUpperCase() ===
              feature.code.split("/").pop()!.toUpperCase()
          )
      )
    }))
    .filter(
      (classification) => (classification.features?.length || -1) > 0
    ) as ClassificationWithFeatures[];

export const getBim = (assets?: readonly PimAsset[]): BIM | undefined => {
  const bim = assets?.find((asset) => asset.assetType === "BIM");
  if (!bim) {
    return;
  }
  return {
    name: bim.name,
    url: bim.url
  };
};

export const isLinkAsset = (asset: PimAsset) => {
  return !asset.realFileName && !!asset.url;
};

export const isImageAsset = (asset: PimAsset) => {
  return (
    asset.realFileName &&
    (asset.realFileName.search(/.jpg/i) > -1 ||
      asset.realFileName.search(/.png/i) > -1)
  );
};

const isPDFAsset = (asset: PimAsset) => {
  return (
    asset.url?.indexOf(".pdf") > -1 ||
    (asset.realFileName && asset.realFileName.indexOf(".pdf") > -1)
  );
};

export const getGuaranteesAndWarrantiesAsset = (
  type: GuaranteesAndWarrantiesAssetType,
  assets: readonly PimAsset[]
) => {
  const guaranteesAndWarranties = assets.filter(
    (asset) =>
      asset.assetType === "GUARANTIES" || asset.assetType === "WARRANTIES"
  );
  switch (type) {
    case GuaranteesAndWarrantiesAssetType.Links:
      return guaranteesAndWarranties.filter(isLinkAsset);
    case GuaranteesAndWarrantiesAssetType.Images:
      return guaranteesAndWarranties.filter(isImageAsset);
  }
};

export const getAwardAndCertificateAsset = (
  type: AwardAndCertificateAssetType,
  assets: readonly PimAsset[]
) => {
  const awardAndCertificates = assets.filter(
    (asset) =>
      asset.assetType === "AWARDS" || asset.assetType === "CERTIFICATES"
  );
  switch (type) {
    case AwardAndCertificateAssetType.Documents:
      return awardAndCertificates.filter((asset: PimAsset) =>
        isPDFAsset(asset)
      );
    case AwardAndCertificateAssetType.Images:
      return awardAndCertificates.filter(
        (asset: PimAsset) => !isPDFAsset(asset)
      );
  }
};

export const getBrand = (
  categories?: readonly PimCategory[]
): Brand | undefined => {
  const brand = categories?.filter(
    ({ categoryType }) => categoryType === "Brand"
  );

  const defaultBrand: Brand = {
    code: "BMI",
    name: "BMI",
    logo: "BMI"
  };

  if (brand) {
    if (brand.length > 1 || brand.length === 0) {
      return defaultBrand;
    } else {
      return {
        code: brand[0].code,
        name: brand[0].name,
        logo: brand[0].image?.url
      };
    }
  } else {
    return defaultBrand;
  }
};

export const getCategories = (categories: readonly PimCategory[]): Category[] =>
  categories.filter((category) => category.categoryType !== "Channel");

export const mapClassification = (
  classification: PimClassification
): Classification => ({
  name: classification.name,
  features: classification.features!.map((feature) => ({
    name: feature.name,
    value: `${feature.featureValues[0].value} ${
      feature.featureUnit?.symbol || ""
    }`.trim()
  }))
});

export const getScoringWeight = (
  classifications?: readonly PimClassification[]
) =>
  Number.parseInt(
    classifications
      ?.find(
        (classification) =>
          classification.features?.some(
            (feature) =>
              // TODO: Remove upercase checks - DXB-3449
              feature.code.split("/").pop()!.toUpperCase() ===
              "scoringWeightAttributes.scoringweight".toUpperCase()
          )
      )
      ?.features?.find(
        (feature) =>
          // TODO: Remove upercase checks - DXB-3449
          feature.code.split("/").pop()!.toUpperCase() ===
          "scoringWeightAttributes.scoringweight".toUpperCase()
      )?.featureValues[0].value || "0"
  );

export const groupImages = (images: readonly PimImage[]): PimImage[][] =>
  Object.values(groupByContainerId(images));

const groupByContainerId = (
  arr: readonly PimImage[]
): { [key: string]: PimImage[] } => {
  return arr.reduce(
    (acc: { [key: string]: PimImage[] }, currentValue: PimImage) => {
      if (!acc[currentValue["containerId"]]) {
        acc[currentValue["containerId"]] = [];
      }
      acc[currentValue["containerId"]].push(currentValue);
      return acc;
    },
    {}
  );
};

export const mapDocuments = (assets?: readonly PimAsset[]): Document[] =>
  (assets || [])
    .map((asset) => {
      const { url, fileSize, realFileName, mime, assetType } = asset;

      if (!url) {
        return;
      }

      const baseData = {
        id: generateHashFromString(asset.url)
      };

      if (isPimLinkDocument(asset)) {
        return {
          ...baseData,
          assetType,
          isLinkDocument: true,
          title: asset.name,
          url
        };
      }

      if (!fileSize || !realFileName) {
        return;
      }
      //fot assetType of warranties and guaranties check the format of the image is only jpeg,jpg and png
      const format = mime || getFormatFromFileName(realFileName);
      if (
        (assetType === "WARRANTIES" || assetType === "GUARANTIES") &&
        //check if its image asset
        format?.split("/")[0] === "image" &&
        //check if only right format is included
        !["image/jpeg", "image/png", "image/jpg"].includes(format)
      ) {
        return;
      }

      return {
        ...baseData,
        assetType,
        fileSize,
        format,
        extension: realFileName.split(".").pop(),
        isLinkDocument: false,
        title: asset.name,
        realFileName,
        url
      };
    })
    .filter(isDefined);

const MAX_SIZE_ALLOWED_BYTES = 41943040; // 40MB

const isPimLinkDocument = (asset: Asset) => {
  // TODO: We're forced to do this because PIM doesn't have the correct data
  // wrt allowedToDownload.
  const { allowedToDownload, url, fileSize, realFileName } = asset;

  if (!allowedToDownload) {
    return true;
  }

  if (fileSize > MAX_SIZE_ALLOWED_BYTES) {
    return true;
  }

  return !fileSize && !realFileName && !!url;
};

const mapExtensionToFormat: { [key: string]: Mime } = {
  pdf: "application/pdf",
  zip: "application/zip",
  gif: "image/gif",
  jpg: "image/jpg",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp",
  tiff: "image/tiff"
};

const getFormatFromFileName = (filename: string) =>
  mapExtensionToFormat[path.extname(filename).substring(1)];

export const mapImages = (
  groupedImages: readonly PimImage[][],
  assetType: ImageAssetType
): Image[] => {
  const result: Image[] = [];
  groupedImages.map((images) => {
    let mainSource;
    let thumbnail;
    let altText: string | undefined;
    let imageName;
    let imageFormat;
    images.forEach((image) => {
      if (image.assetType !== assetType) {
        return;
      }

      if (!altText) {
        altText = image.altText;
      }
      if (!image.format && !altText) {
        altText = cleanImageName(image.name, image.format);
      }

      imageName = image.name;
      imageFormat = image.format;

      if (image.format === "Product-Hero-Small-Desktop-Tablet") {
        mainSource = image.url;
        return;
      }
      if (image.format === "Product-Color-Selector-Mobile") {
        thumbnail = image.url;
        return;
      }
    });

    if (!mainSource) {
      return;
    }

    if (!altText) {
      altText = cleanImageName(imageName!, imageFormat);
    }

    result.push({
      mainSource,
      thumbnail,
      altText
    });
  });
  return result;
};

export const getVideoUrl = (url?: string) =>
  url
    ? url.startsWith("https://")
      ? url
      : `https://www.youtube.com/watch?v=${url}`
    : "";

// TODO: DXB-7950 - remove this logic once altText is mandatory in PIM
export const cleanImageName = (
  imageName: string,
  format: ImageFormat | undefined
) => {
  imageName = imageName.replace(`.${path.extname(imageName).substring(1)}`, "");

  if (format && imageName.startsWith(format)) {
    imageName = imageName.replace(format, "");
  }

  if (/^\s+/.test(imageName)) {
    imageName = imageName.trimStart();
  } else if (imageName.startsWith("_") || imageName.startsWith("-")) {
    imageName = imageName.substring(1);
  }

  return imageName.replace(/[_-]/g, " ");
};
