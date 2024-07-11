import type { ParentPage } from "./Common";
import type { Data as BrandData } from "../../../components/Brands";
import type { Card as OverlapCard } from "../../../components/OverlapCards";
import type { Data as HomePageData } from "../../../templates/home-page";
import type { ContentfulHeroSlides } from "../ContentfulHeroSlides";
import type { ContentfulSignUpBlockData } from "./SignUpBlock";
import type { Video as ContentfulVideo } from "./Video";

export type ContentfulBrand = Pick<
  BrandData,
  "title" | "subtitle" | "brandLogo"
> & {
  sys: {
    id: string;
  };
  slug: string;
  parentPage: ParentPage | null;
};

export type ContentfulOverlapCard = Pick<
  OverlapCard,
  "title" | "featuredMedia"
> & {
  __typename: "Page" | "ContactUsPage" | "DocumentLibraryPage";
  sys: {
    id: string;
  };
  slug: string;
  featuredVideo: ContentfulVideo | null;
  parentPage: ParentPage | null;
};

export type ContentfulHomePage = Omit<
  HomePageData["homePage"],
  "slides" | "overlapCards" | "sections" | "signupBlock"
> & {
  overlapCardsCollection: {
    items: [
      ContentfulOverlapCard,
      ContentfulOverlapCard,
      ...ContentfulOverlapCard[]
    ];
  };
  slidesCollection: {
    items: ContentfulHeroSlides;
  };
  sectionsCollection: {
    items: {
      sys: {
        id: string;
      };
    }[];
  };
  signupBlock: ContentfulSignUpBlockData;
};
