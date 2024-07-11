import { ContentfulPromoCard } from "../Contentful";

const createContentfulPromoCard = (
  contentfulPromo?: Partial<ContentfulPromoCard>
): ContentfulPromoCard => ({
  id: "promo-1",
  spaceId: "space-id",
  contentful_id: "contentful_id",
  createdAt: "",
  updatedAt: "",
  parent: "",
  node_locale: "en-GB",
  title: "promo-title",
  subtitle: "promo-sub-title",
  body: null,
  cta___NODE: null,
  cta: {
    linkedPage: { path: "https://somewhere.com" },
    url: "https://somewhere.com",
    label: "click here to go somewhere"
  },
  featuredVideo: null,
  featuredMedia: {
    __typename: "Image",
    title: "Title",
    altText: "alt-text-img",
    type: "Decorative",
    focalPoint: null,
    image: {
      fileName: "file1.jpg",
      url: "https://nowhere.com",
      contentType: "image/jpeg",
      width: 100,
      height: 100,
      size: 100
    }
  },
  resources___NODE: [],
  metadata: { tags___NODE: [] },
  children: [],
  internal: {
    type: "Promo",
    contentDigest: "digest",
    owner: "contentful"
  },
  __typename: "Promo",
  ...contentfulPromo
});

export default createContentfulPromoCard;
