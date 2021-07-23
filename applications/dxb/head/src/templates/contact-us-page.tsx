import React from "react";
import { graphql } from "gatsby";
import Typography from "@bmi/typography";
import Section from "@bmi/section";
import Hero, { HeroItem } from "@bmi/hero";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../components/Breadcrumbs";
import { Data as SiteData } from "../components/Site";
import Page, { Data as PageData } from "../components/Page";
import { Data as TitleWithContentData } from "../components/TitleWithContent";
import TabsOrAccordionSection from "../components/TabsOrAccordionSection";
import Sections, { Data as SectionsData } from "../components/Sections";
import IframeSection, {
  Data as IframeSectionData
} from "../components/IframeSection";
import NextBestActions, {
  Data as NextBestActionsData
} from "../components/NextBestActions";
import { Data as PageInfoData } from "../components/PageInfo";
import ContactTopics, {
  Data as ContactTopicsData
} from "../components/ContactTopics";
import Locations, { Data as LocationsData } from "../components/Locations";
import { renderVideo } from "../components/Video";
import { renderImage } from "../components/Image";

export type Data = PageInfoData &
  PageData & {
    __typename: "ContentfulContactUsPage";
    queriesTitle: string;
    queriesSubtitle: string;
    otherAreasTitle: string;
    otherAreas: readonly TitleWithContentData[];
    contentTopics: ContactTopicsData[] | null;
    sections: SectionsData | null;
    locationsTitle: string | null;
    locations: LocationsData | null;
    iframe: IframeSectionData | null;
    nextBestActions: NextBestActionsData | null;
    breadcrumbs: BreadcrumbsData;
  };

type Props = {
  data: {
    contentfulContactUsPage: Data;
    contentfulSite: SiteData;
  };
  pageContext: {
    variantCodeToPathMap: Record<string, string>;
  };
};

const ContactUsPage = ({ data, pageContext }: Props) => {
  const {
    title,
    subtitle,
    featuredMedia,
    queriesTitle,
    queriesSubtitle,
    otherAreasTitle,
    otherAreas,
    contentTopics,
    inputBanner,
    sections,
    locationsTitle,
    locations,
    iframe,
    nextBestActions,
    breadcrumbs,
    seo,
    featuredVideo
  } = data.contentfulContactUsPage;
  const heroProps: HeroItem = {
    title,
    children: subtitle,
    media: featuredVideo
      ? renderVideo(featuredVideo)
      : renderImage(featuredMedia, { size: "cover" })
  };
  const pageData: PageData = {
    breadcrumbs,
    inputBanner,
    seo
  };

  return (
    <Page
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
      ogImageUrl={featuredMedia?.image?.file.url}
    >
      <Hero
        level={1}
        {...heroProps}
        breadcrumbs={<Breadcrumbs data={breadcrumbs} isDarkThemed />}
      />
      <Section backgroundColor="pearl">
        <Section.Title>{queriesTitle}</Section.Title>
        <Typography variant="h4" component="p">
          {queriesSubtitle}
        </Typography>
        {contentTopics && (
          <div style={{ marginTop: "40px" }}>
            <ContactTopics topics={contentTopics} />
          </div>
        )}
      </Section>
      {iframe && <IframeSection data={iframe} />}
      {sections && <Sections data={sections} />}
      {locations && (
        <Section backgroundColor="white">
          <Section.Title>{locationsTitle}</Section.Title>
          <div>
            <Locations data={locations} />
          </div>
        </Section>
      )}
      <TabsOrAccordionSection
        data={{
          __typename: "ContentfulTabsOrAccordionSection",
          title: otherAreasTitle,
          description: null,
          items: otherAreas,
          type: "Accordion"
        }}
      />
      {nextBestActions && <NextBestActions data={nextBestActions} />}
      <Section backgroundColor="alabaster" isSlim>
        <Breadcrumbs data={breadcrumbs} />
      </Section>
    </Page>
  );
};

export default ContactUsPage;

export const pageQuery = graphql`
  query ContactUsPageById($pageId: String!, $siteId: String!) {
    contentfulContactUsPage(id: { eq: $pageId }) {
      ...PageInfoFragment
      ...BreadcrumbsFragment
      queriesTitle
      queriesSubtitle
      contentTopics {
        ...ContactTopicsFragment
      }
      otherAreasTitle
      otherAreas {
        ...TitleWithContentFragment
      }
      ...PageFragment
      sections {
        ...SectionsFragment
      }
      locationsTitle
      locations {
        ...LocationsFragment
      }
      iframe {
        ...IframeSectionFragment
      }
      nextBestActions {
        ...NextBestActionsFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
