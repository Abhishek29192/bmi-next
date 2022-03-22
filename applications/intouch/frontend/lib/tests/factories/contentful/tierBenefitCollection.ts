import { GetPartnerBrandsQuery } from "../../../../graphql/generated/operations";

export const generateTierBenefitItem = (
  item = null
): GetPartnerBrandsQuery["tierBenefitCollection"]["items"][0] => ({
  name: "tier benefit name",
  description: {
    __typename: "TierBenefitDescription",
    json: {
      nodeType: "document",
      content: [],
      data: {}
    }
  },
  ...item
});

export const generateTierBenefitCollection =
  (): GetPartnerBrandsQuery["tierBenefitCollection"] => ({
    items: [generateTierBenefitItem()]
  });
