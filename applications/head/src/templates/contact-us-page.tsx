import React from "react";
import { graphql } from "gatsby";
import Typography from "@bmi/typography";
import Section from "@bmi/section";
import Breadcrumbs from "../components/Breadcrumbs";
import { Data as SiteData } from "../components/Site";
import Hero, { HeroItem } from "@bmi/hero";
import Page, { Data as PageData } from "../components/Page";
import { Data as TitleWithContentData } from "../components/TitleWithContent";
import TabsOrAccordionSection from "../components/TabsOrAccordionSection";
import { Data as PageInfoData } from "../components/PageInfo";
import ContactTopics, {
  Data as ContactTopicsData
} from "../components/ContactTopics";
import Locations, { Data as LocationsData } from "../components/Locations";

type Data = PageInfoData &
  PageData & {
    __typename: "ContentfulContactUsPage";
    queriesTitle: string;
    queriesSubtitle: string;
    otherAreasTitle: string;
    otherAreas: readonly TitleWithContentData[];
    contentTopics: ContactTopicsData[];
    locationsTitle: string | null;
    locations: LocationsData | null;
  };

type Props = {
  data: {
    contentfulContactUsPage: Data;
    contentfulSite: SiteData;
  };
};

const ContactUsPage = ({ data }: Props) => {
  const {
    title,
    subtitle,
    featuredImage,
    queriesTitle,
    queriesSubtitle,
    otherAreasTitle,
    otherAreas,
    contentTopics,
    slug,
    inputBanner,
    locationsTitle,
    locations
  } = data.contentfulContactUsPage;
  const heroProps: HeroItem = {
    title,
    children: subtitle,
    imageSource: featuredImage?.file.url
  };
  const pageData: PageData = {
    slug,
    inputBanner
  };

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      <Hero
        level={1}
        {...heroProps}
        breadcrumbs={
          <Breadcrumbs
            title={title}
            slug={slug}
            menuNavigation={data.contentfulSite.menuNavigation}
            isDarkThemed
          />
        }
      />
      <Section backgroundColor="pearl" hasRevertOverflow>
        <Section.Title>{queriesTitle}</Section.Title>
        <Typography variant="h4" component="p">
          {queriesSubtitle}
        </Typography>
        <div style={{ marginTop: "40px" }}>
          {contentTopics && <ContactTopics topics={contentTopics} />}
        </div>
      </Section>
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
      <Section backgroundColor="alabaster" isSlim>
        <Breadcrumbs
          title={title}
          slug={slug}
          menuNavigation={data.contentfulSite.menuNavigation}
        />
      </Section>
    </Page>
  );
};

export default ContactUsPage;

export const pageQuery = graphql`
  query ContactUsPageById($pageId: String!, $siteId: String!) {
    contentfulContactUsPage(id: { eq: $pageId }) {
      ...PageInfoFragment
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
      locationsTitle
      locations {
        ...LocationsFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
