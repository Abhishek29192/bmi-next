import { Button, ButtonProps } from "@bmi-digital/components";
import { Hero, HeroItem } from "@bmi-digital/components";
import { Search } from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
import Brands, { Data as BrandData } from "../components/Brands";
import Link from "../components/Link";
import OverlapCards, {
  Data as OverlapCardData
} from "../components/OverlapCards";
import Page, { Data as PageData } from "../components/Page";
import { Data as PageInfoData } from "../components/PageInfo";
import { Data as SlideData } from "../components/Promo";
import Sections, { Data as SectionsData } from "../components/Sections";
import { Data as SiteData } from "../components/Site";
import WelcomeDialog from "../components/WelcomeDialog";
import withGTM from "../utils/google-tag-manager";
import { renderVideo } from "../components/Video";
import { renderImage } from "../components/Image";
import { getPathWithCountryCode } from "../utils/path";
import { microCopy } from "../constants/microCopies";

type HomepageData = {
  __typename: "ContentfulHomePage";
  title: string;
  slides: (SlideData | PageInfoData)[];
  overlapCards: OverlapCardData;
  brands: BrandData[];
  sections: SectionsData | null;
} & PageData;

type Props = {
  data: {
    contentfulHomePage: HomepageData;
    contentfulSite: SiteData;
  };
  pageContext: {
    variantCodeToPathMap: Record<string, string>;
  };
};

const getHeroItemsWithContext = (
  { getMicroCopy },
  slides: HomepageData["slides"]
): HeroItem[] => {
  return slides.map(
    ({ title, subtitle, featuredMedia, featuredVideo, ...rest }) => {
      const callToAction =
        rest.__typename === "ContentfulPromo" && rest.cta ? (
          <Link component={Button} data={rest.cta}>
            {rest.cta?.label}
          </Link>
        ) : (
          <Link
            component={Button}
            data={{ linkedPage: { path: rest["path"] } }}
          >
            {getMicroCopy(microCopy.PAGE_LINK_LABEL)}
          </Link>
        );

      return {
        title,
        children: subtitle,
        media: featuredVideo
          ? renderVideo(featuredVideo)
          : renderImage(featuredMedia, { size: "cover" }),
        cta: rest["cta"] || rest["path"] ? callToAction : null
      };
    }
  );
};

const HomePage = ({ data, pageContext }: Props) => {
  const {
    __typename,
    title,
    slides,
    overlapCards,
    brands,
    sections,
    inputBanner,
    seo
  } = data.contentfulHomePage;
  const pageData: PageData = {
    breadcrumbs: null,
    inputBanner,
    seo,
    path: data.contentfulHomePage.path
  };
  const { welcomeDialogTitle, welcomeDialogBody, welcomeDialogBrands } =
    data.contentfulSite.resources || {};
  const GTMButton = withGTM<ButtonProps>(Button);

  return (
    <Page
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
      ogImageUrl={slides?.[0]?.featuredMedia.image?.file.url}
    >
      {({ siteContext }) => {
        const { countryCode, getMicroCopy } = siteContext;
        const heroItems = getHeroItemsWithContext(siteContext, slides);

        return (
          <>
            <Hero level={0} heroes={heroItems} hasSpaceBottom>
              <Search
                buttonComponent={(props) => (
                  <GTMButton
                    gtm={{
                      id: "search2",
                      label: getMicroCopy(microCopy.SEARCH_LABEL)
                    }}
                    {...props}
                  />
                )}
                action={getPathWithCountryCode(countryCode, "search")}
                label={getMicroCopy(microCopy.SEARCH_LABEL)}
                placeholder={getMicroCopy(microCopy.SEARCH_PLACEHOLDER_HERO)}
              />
            </Hero>
            {overlapCards && <OverlapCards data={overlapCards} />}
            {brands?.length ? <Brands data={brands} /> : null}
            {sections && <Sections data={sections} pageTypename={__typename} />}
            <WelcomeDialog
              data={{
                welcomeDialogTitle,
                welcomeDialogBody,
                welcomeDialogBrands
              }}
            />
          </>
        );
      }}
    </Page>
  );
};

export default HomePage;

export const pageQuery = graphql`
  query HomePageById($pageId: String!, $siteId: String!) {
    contentfulHomePage(id: { eq: $pageId }) {
      __typename
      # Only fetching slug to get it in the JSON file so it's indexed
      slug
      title
      slides {
        ... on ContentfulPromoOrPage {
          ...PromoFragment
          ...PageInfoFragment
        }
      }
      overlapCards {
        ...OverlapCardFragment
      }
      brands {
        ...BrandFragment
      }
      sections {
        ...SectionsFragment
      }
      inputBanner {
        ...InputBannerFragment
      }
      seo {
        ...SEOContentFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
