import { Data } from "../../components/Promo";
import createRichText from "./RichTextHelper";
import createTagData from "./TagHelper";
import createImageData from "./ImageDataHelper";
import createLinkData from "./LinkHelper";
import createVideoData from "./VideoHelper";

const createPromoData = (promoData?: Partial<Data>): Data => ({
  __typename: "Promo",
  id: "contentful-id",
  name: "Contentful Promo data",
  title: "Contentful Promo Title",
  subtitle: "Contentful Promo Subtitle",
  body: createRichText(),
  brandLogo: "AeroDek",
  tags: [createTagData()],
  featuredMedia: createImageData(),
  cta: createLinkData(),
  featuredVideo: createVideoData(),
  backgroundColor: "White",
  ...promoData
});

export default createPromoData;
