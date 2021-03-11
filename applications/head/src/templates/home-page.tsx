import Button, { ButtonProps } from "@bmi/button";
import Hero, { HeroItem } from "@bmi/hero";
import Search from "@bmi/search";
import { graphql } from "gatsby";
import React from "react";
import Brands, { Data as BrandData } from "../components/Brands";
import { getCTA } from "../components/Link";
import OverlapCards, {
  Data as OverlapCardData
} from "../components/OverlapCards";
import Page, { Data as PageData } from "../components/Page";
import { Data as PageInfoData } from "../components/PageInfo";
import { Data as SlideData } from "../components/Promo";
import Sections, { Data as SectionsData } from "../components/Sections";
import { Data as SiteData, SiteContext } from "../components/Site";
import WelcomeDialog from "../components/WelcomeDialog";
import withGTM from "../utils/google-tag-manager";

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
};

const getHeroItemsWithContext = (
  { getMicroCopy, countryCode },
  slides: HomepageData["slides"]
): HeroItem[] => {
  return slides.map(({ title, subtitle, featuredImage, ...rest }) => {
    return {
      title,
      children: subtitle,
      imageSource: featuredImage?.resize.src,
      CTA: getCTA(rest, countryCode, getMicroCopy("page.linkLabel"))
    };
  });
};

const HomePage = ({ data }: Props) => {
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
    seo
  };
  const { welcomeDialogTitle, welcomeDialogBody, welcomeDialogBrands } =
    data.contentfulSite.resources || {};
  const GTMButton = withGTM<ButtonProps>(Button);

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      <SiteContext.Consumer>
        {(context) => {
          const { countryCode, getMicroCopy } = context;
          const heroItems = getHeroItemsWithContext(context, slides);
          return (
            <Hero level={0} heroes={heroItems} hasSpaceBottom>
              <Search
                buttonComponent={(props) => (
                  <GTMButton
                    gtm={{ id: "search2", label: getMicroCopy("search.label") }}
                    {...props}
                  />
                )}
                action={`/${countryCode}/search`}
                label={getMicroCopy("search.label")}
                placeholder={getMicroCopy("search.placeholder.hero")}
              />
            </Hero>
          );
        }}
      </SiteContext.Consumer>
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
