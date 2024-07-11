import createPromoData from "./PromoHelper";
import createVideoData from "./VideoHelper";
import createImageData from "./ImageDataHelper";
import type { Data as HomepageData } from "../../templates/home-page";

const createHomePageData = (
  homepageData?: Partial<HomepageData["homePage"]>
): HomepageData["homePage"] => ({
  __typename: "HomePage",
  title: "title",
  slides: [createPromoData()],
  overlapCards: [
    {
      title: "Promo Card with Video",
      featuredMedia: null,
      featuredVideo: createVideoData(),
      path: "promo-video/"
    },
    {
      title: "PageInfo Card with Image",
      featuredMedia: createImageData(),
      featuredVideo: null,
      path: "page-info-video/"
    }
  ],
  sections: [createPromoData()],
  signupBlock: null,
  seo: null,
  ...homepageData
});

export default createHomePageData;
