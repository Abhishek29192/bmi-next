import createTagData from "../../../../__tests__/helpers/TagHelper";
import createImageData from "../../../../__tests__/helpers/ImageDataHelper";
import createContentfulLink from "./ContentfulLinkHelper";
import createContentfulVideoData from "./ContetfulVideoHelper";
import createContentfulRichText from "./ContentfulRichText";
import type { ContentfulPromo } from "../Promo";

const createContentfulPromoData = (
  promoData?: Partial<ContentfulPromo>
): ContentfulPromo => ({
  __typename: "Promo",
  id: "contentful-id",
  name: "Contentful Promo data",
  title: "Contentful Promo Title",
  subtitle: "Contentful Promo Subtitle",
  body: createContentfulRichText(),
  brandLogo: "AeroDek",
  tagsCollection: { items: [createTagData()] },
  featuredMedia: createImageData(),
  cta: createContentfulLink(),
  featuredVideo: createContentfulVideoData(),
  backgroundColor: "White",
  ...promoData
});

export default createContentfulPromoData;
