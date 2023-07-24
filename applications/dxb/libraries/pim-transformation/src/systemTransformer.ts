import {
  Asset,
  AwardAndCertificateAssetType,
  Classification,
  GuaranteesAndWarrantiesAssetType,
  KeyFeatures,
  System,
  SystemDocument,
  SystemLayer,
  Video
} from "@bmi/firestore-types";
import { System as PimSystem } from "@bmi/pim-types";
import { generateHashFromString, generateUrl } from "@bmi/utils";
import { systemIgnorableAttributes } from "./ignorableFeatureCodes.js";
import {
  filterClassifications,
  getAwardAndCertificateAsset,
  getBim,
  getBrand,
  getCategories,
  getGuaranteesAndWarrantiesAsset,
  getScoringWeight,
  getVideoUrl,
  groupImages,
  mapClassification,
  mapDocuments,
  mapImages
} from "./transformerUtils.js";

export const transformSystem = (system: PimSystem): System[] => {
  if (system.approvalStatus !== "approved") {
    return [];
  }
  let promotionalContent: string | undefined;
  let uniqueSellingPropositions: string[] = [];
  system.classifications?.forEach((classification) => {
    classification.features?.forEach((feature) => {
      const featureCode = feature.code.split("/").pop()!;
      // TODO: Remove upercase checks - DXB-3449
      if (
        featureCode.toUpperCase() ===
        "systemAttributes.promotionalcontent".toUpperCase()
      ) {
        promotionalContent = feature.featureValues[0].value;
      } else if (
        featureCode.toUpperCase() ===
        "systemAttributes.uniquesellingpropositions".toUpperCase()
      ) {
        uniqueSellingPropositions = feature.featureValues.map(
          (value) => value.value
        );
      }
    });
  });
  const code = system.code;
  const hashedCode = generateHashFromString(system.code);
  const name = system.name;
  const groupedImages = groupImages(system.images || []);
  return [
    {
      awardsAndCertificateDocuments: getAwardAndCertificateAsset(
        AwardAndCertificateAssetType.Documents,
        system.assets
      ),
      awardsAndCertificateImages: getAwardAndCertificateAsset(
        AwardAndCertificateAssetType.Images,
        system.assets
      ),
      bim: getBim(system.assets),
      brand: getBrand(system.categories),
      categories: getCategories(system.categories || []),
      classifications: mapClassifications(system),
      code,
      description: system.longDescription,
      documents: mapSystemDocuments(system),
      goodBetterBest: system.goodBetterBest,
      guaranteesAndWarrantiesImages: getGuaranteesAndWarrantiesAsset(
        GuaranteesAndWarrantiesAssetType.Images,
        system.assets
      ),
      guaranteesAndWarrantiesLinks: getGuaranteesAndWarrantiesAsset(
        GuaranteesAndWarrantiesAssetType.Links,
        system.assets
      ),
      hashedCode,
      galleryImages: mapImages(groupedImages, "GALLERY"),
      masterImage: mapImages(groupedImages, "MASTER_IMAGE")?.[0],
      keyFeatures: mapKeyFeatures(system),
      layerCodes: (system.systemLayers || []).map((layer) => layer.code),
      name,
      path: `/s/${generateUrl([name, hashedCode])}`,
      promotionalContent,
      scoringWeight: getScoringWeight(system.classifications),
      shortDescription: system.shortDescription,
      specification: getSpecification(system),
      systemBenefits: system.systemBenefits,
      systemLayers: mapSystemLayers(system),
      systemReferences: mapSystemReferences(system),
      uniqueSellingPropositions,
      videos: mapVideos(system)
    }
  ];
};

const mapClassifications = (system: PimSystem): Classification[] =>
  filterClassifications(
    system.classifications || [],
    systemIgnorableAttributes
  ).map(mapClassification);

const assetTypesToIgnore = [
  "BIM",
  "CERTIFICATES",
  "AWARDS",
  "GUARANTIES",
  "WARRANTIES"
];

const mapSystemDocuments = (system: PimSystem): SystemDocument[] =>
  mapDocuments(
    (system.assets || []).filter(
      (asset) =>
        !assetTypesToIgnore.some((assetType) => assetType === asset.assetType)
    )
  );

const mapKeyFeatures = (system: PimSystem): KeyFeatures | undefined => {
  const classification = system.classifications?.find(
    // TODO: Remove upercase checks - DXB-3449
    (classification) =>
      classification.code.toUpperCase() === "systemAttributes".toUpperCase()
  );
  if (!classification) {
    return;
  }

  const keyFeatureValues = classification.features
    ?.find(
      (feature) =>
        // TODO: Remove upercase checks - DXB-3449
        feature.code.split("/").pop()!.toUpperCase() ===
        "systemAttributes.keyfeatures".toUpperCase()
    )
    ?.featureValues.map((featureValue) => featureValue.value.trim())
    ?.filter(Boolean);

  if (!keyFeatureValues?.length) {
    return;
  }

  return {
    name: classification.name,
    values: keyFeatureValues
  };
};

const getSpecification = (system: PimSystem): Asset | undefined =>
  system.assets?.find((asset) => asset.assetType === "SPECIFICATION");

const mapSystemLayers = (system: PimSystem): SystemLayer[] =>
  (system.systemLayers || [])
    .filter((systemLayer) => systemLayer.approvalStatus === "approved")
    .map((systemLayer) => ({
      layerNumber: systemLayer.layerNumber,
      name: systemLayer.name,
      relatedProducts: (systemLayer.products || []).map(
        (product) => product.code
      ),
      relatedOptionalProducts: (systemLayer.optionalProducts || []).map(
        (product) => product.code
      ),
      type: systemLayer.type,
      shortDescription: systemLayer.shortDescription
    }));

const mapSystemReferences = (system: PimSystem): string[] =>
  (system.systemReferences || [])
    .filter(
      (systemReference) => systemReference.referenceType === "CROSSELLING"
    )
    .map((systemReference) => systemReference.target.code);

const mapVideos = (system: PimSystem): Video[] =>
  (system.assets || [])
    .filter((asset) => asset.assetType === "VIDEO")
    .map((asset) => ({
      title: "",
      label: asset.name,
      subtitle: null,
      previewMedia: null,
      videoRatio: null,
      videoUrl: getVideoUrl(asset.url)
    }));
