import { GetPartnerBrandsQuery } from "../../../../graphql/generated/operations";

export const generatePartnerBrandItem = (
  PartnerBrandItem = null
): GetPartnerBrandsQuery["marketContentCollection"]["items"][0]["partnerBrandsCollection"]["items"][0] => ({
  name: "partner brand name",
  shortDescription: "partner brand shortDescription",
  image: {
    title: "partner brand image title",
    description: "partner brand image description",
    contentType: "partner brand image contentType",
    fileName: "partner brand image fileName",
    size: 1,
    url: "partner brand image url",
    width: 10,
    height: 10
  },
  logo: {
    title: "partner brand logo title",
    description: "partner brand logo description",
    contentType: "partner brand logo contentType",
    fileName: "partner brand logo fileName",
    size: 1,
    url: "partner brand logo url",
    width: 10,
    height: 10
  },
  ...PartnerBrandItem
});

export const generateMarketContentItem = (
  item: GetPartnerBrandsQuery["marketContentCollection"]["items"][0] = {},
  partnerBrandItem: GetPartnerBrandsQuery["marketContentCollection"]["items"][0]["partnerBrandsCollection"]["items"][0] = {},
  partnerBrandItems: GetPartnerBrandsQuery["marketContentCollection"]["items"][0]["partnerBrandsCollection"]["items"] = []
): GetPartnerBrandsQuery["marketContentCollection"]["items"][0] => ({
  newsItemCta: "newsItemCta",
  newsItemHeading: "newsItemHeading",
  newsItemUrl: "newsItemUrl",
  partnerBrandsCollection: {
    items: [
      {
        ...generatePartnerBrandItem(),
        ...partnerBrandItem
      },
      ...partnerBrandItems
    ]
  },
  ...item
});

export const generateMarketContent = (
  item: GetPartnerBrandsQuery["marketContentCollection"]["items"][0] = {},
  items: GetPartnerBrandsQuery["marketContentCollection"]["items"] = [],
  partnerBrandItem: GetPartnerBrandsQuery["marketContentCollection"]["items"][0]["partnerBrandsCollection"]["items"][0] = {},
  partnerBrandItems: GetPartnerBrandsQuery["marketContentCollection"]["items"][0]["partnerBrandsCollection"]["items"] = []
): GetPartnerBrandsQuery["marketContentCollection"] => ({
  items: [
    generateMarketContentItem(item, partnerBrandItem, partnerBrandItems),
    ...items
  ]
});
