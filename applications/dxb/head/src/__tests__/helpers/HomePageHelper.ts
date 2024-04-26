import createPromoData from "./PromoHelper";
import createVideoData from "./VideoHelper";
import createImageData from "./ImageDataHelper";
import { createInternalLinkData } from "./LinkHelper";
import type { HomepageData } from "../../templates/home-page";

const createHomePageData = (
  homepageData?: Partial<HomepageData>
): HomepageData => ({
  __typename: "ContentfulHomePage",
  title: "title",
  slides: [createPromoData()],
  overlapCards: [
    {
      title: "Promo Card with Video",
      featuredVideo: createVideoData(),
      path: "promo-video/"
    },
    {
      title: "PageInfo Card with Image",
      featuredMedia: createImageData(),
      cta: createInternalLinkData()
    }
  ],
  brands: [
    {
      title: "brand title",
      path: "/brand-path",
      subtitle: undefined,
      brandLogo: "Icopal"
    }
  ],
  sections: [createPromoData()],
  breadcrumbs: null,
  signupBlock: null,
  seo: null,
  path: "/path",
  ...homepageData
});

export default createHomePageData;
