import { GetPartnerBrandsQuery } from "../../../../graphql/generated/operations";

export const generateCarouselItem = (
  item = null
): GetPartnerBrandsQuery["carouselCollection"]["items"][0]["listCollection"]["items"][0] => ({
  __typename: "CarouselItem",
  audienceTiers: "T1",
  body: "Body",
  cta: "PROJECT",
  customUrl: null,
  customUrlButtonText: null,
  header: "header",
  image: {
    title: "image title",
    description: "image description",
    url: "image url"
  },
  ...item
});

export const generateCarouselCollection = (
  items: GetPartnerBrandsQuery["carouselCollection"]["items"] = []
): GetPartnerBrandsQuery["carouselCollection"] => {
  return {
    __typename: "CarouselCollection",
    total: 1,
    items: [
      {
        __typename: "Carousel",
        audienceRole: "COMPANY_ADMIN",
        listCollection: {
          __typename: "CarouselListCollection",
          total: 1,
          items: [generateCarouselItem()]
        }
      },
      ...items
    ]
  };
};
