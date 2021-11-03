import dataJson from "../data/pim-mock-data.json";
import type {
  ApprovalStatus,
  AssetAssetType,
  ImageFormat,
  ImageMime,
  Mime,
  System
} from "../components/types/pim";
import {
  createBaseProduct,
  createVariantOption
} from "../__tests__/PimDocumentProductHelper";

export const systemDetailsMockData: System = {
  ...dataJson,
  approvalStatus: dataJson.approvalStatus as ApprovalStatus,
  assets: dataJson.assets.map((asset) => ({
    ...asset,
    assetType: asset.assetType as AssetAssetType,
    mime: asset.mime as Mime
  })),
  images: dataJson.images.map((image) => ({
    ...image,
    format: image.format as ImageFormat,
    mime: image.mime as ImageMime
  })),
  systemLayers: dataJson.systemLayers.map((layer) => ({
    ...layer,
    approvalStatus: layer.approvalStatus as ApprovalStatus,
    relatedProducts: [
      createBaseProduct({
        name: "Zanda Protector normalstein",
        variantOptions: [
          createVariantOption({
            path: "p/zanda-protector-normalstein/svart/935895622/"
          }),
          createVariantOption({
            path: "p/zanda-protector-normalstein/grå/3844278835/"
          }),
          createVariantOption({
            path: "p/zanda-protector-normalstein/rød/619975412/"
          }),
          createVariantOption({
            path: "p/zanda-protector-normalstein/teglrød/1856300947/"
          })
        ]
      })
    ],
    relatedOptionalProducts: [
      createBaseProduct({
        name: "Zanda Protector normalstein",
        variantOptions: [
          createVariantOption({
            path: "p/zanda-protector-normalstein/svart/935895622/"
          }),
          createVariantOption({
            path: "p/zanda-protector-normalstein/grå/3844278835/"
          }),
          createVariantOption({
            path: "p/zanda-protector-normalstein/rød/619975412/"
          }),
          createVariantOption({
            path: "p/zanda-protector-normalstein/teglrød/1856300947/"
          })
        ]
      })
    ]
  }))
};
