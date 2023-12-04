import React from "react";
import { Button, Hero, RegionCode, Section } from "@bmi-digital/components";
import { graphql } from "gatsby";
import Link, { DataTypeEnum, NavigationData } from "../../components/Link";
import Protected from "../../pages/protected";
import { Data as SiteData } from "../../components/Site";
import Page from "../../components/Page";
import Image from "../../components/Image";

// !!!!FOR DEMO PURPOSE!!!!!
const mockNavigation: NavigationData = {
  __typename: "ContentfulNavigation",
  label: "Main navigation",
  link: null,
  links: [
    {
      __typename: "ContentfulLink",
      id: "string",
      label: "string",
      icon: null,
      isLabelHidden: false,
      url: "link-to-page",
      linkedPage: null,
      type: DataTypeEnum.External,
      parameters: null,
      dialogContent: null,
      hubSpotCTAID: null
    }
  ]
};

const mockNestedNavigation: NavigationData = {
  __typename: "ContentfulNavigation",
  label: "Main navigation",
  link: null,
  links: [
    {
      __typename: "ContentfulNavigation",
      label: "Get in touch",
      link: null,
      links: [
        {
          __typename: "ContentfulLink",
          id: "",
          label: "+44 (0) 1234567890",
          url: "tel:+4401234567890",
          isLabelHidden: null,
          icon: "Phone",
          linkedPage: null,
          type: DataTypeEnum.External,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null
        }
      ]
    },
    {
      __typename: "ContentfulNavigation",
      label: "About BMI",
      link: null,
      links: [
        {
          __typename: "ContentfulLink",
          id: "",
          label: "Our story",
          url: null,
          isLabelHidden: null,
          icon: null,
          linkedPage: {
            path: "landing-page"
          },
          type: DataTypeEnum.Internal,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null
        }
      ]
    },
    {
      __typename: "ContentfulLink",
      id: "string",
      label: "string",
      icon: null,
      isLabelHidden: false,
      url: "link-to-page",
      linkedPage: null,
      type: DataTypeEnum.External,
      parameters: null,
      dialogContent: null,
      hubSpotCTAID: null
    }
  ]
};

const siteData: SiteData = {
  node_locale: "no-En",
  homePage: {
    title: "Home page title"
  },
  countryCode: "no",
  footerMainNavigation: mockNavigation,
  footerSecondaryNavigation: mockNavigation,
  menuNavigation: mockNestedNavigation,
  menuUtilities: mockNavigation,
  resources: null,
  headScripts: null,
  pitchedRoofCalculatorConfig: null,
  visualiserHouseTypes: [],
  regions: [
    {
      label: "Europe",
      regionCode: RegionCode.Europe,
      menu: [
        { code: "al", label: "Albania", icon: "/icons/flags/al.svg" },
        { code: "at", label: "Österreich", icon: "/icons/flags/at.svg" },
        { code: "uk", label: "United Kingdom", icon: "/icons/flags/uk.svg" }
      ]
    }
  ]
};

const MyAccountPage = ({ data }: any) => {
  const {
    featuredMedia,
    salutation,
    description,
    titleForToolSection,
    titleForServiceSupportSection
  } = data.contentfulSite.accountPage;
  return (
    <Protected>
      <Page title="My acc page" pageData={data} siteData={siteData}>
        <Hero
          level={1}
          title={salutation}
          media={featuredMedia && <Image {...featuredMedia} size="cover" />}
        >
          {description}
        </Hero>
        <Section backgroundColor="pearl" overflowVisible>
          <Section.Title>{titleForToolSection}</Section.Title>
        </Section>

        <Section backgroundColor="pearl" overflowVisible>
          <Section.Title>{titleForServiceSupportSection}</Section.Title>
        </Section>
        <Link href="https://dev-no.intouch.bmigroup.com/profile">
          GO TO MY PROFILE
        </Link>
        <Button href="https://dev-no.intouch.bmigroup.com/roof-measurement">
          GO TO MY ROOF MEASUREMENT
        </Button>
        <Button href="https://dev-no.intouch.bmigroup.com/training">
          GO TO MY ROOF TRAINING
        </Button>
      </Page>
    </Protected>
  );
};
export default MyAccountPage;

export const pageQuery = graphql`
  query AccountPage($siteId: String!) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
      accountPage {
        slug
        featuredMedia {
          ...ImageDocumentFragment
        }
        salutation
        description
        titleForToolSection
        titleForServiceSupportSection
        allowTools
        serviceSupportCards {
          ...ContactDetailsFragment
        }
      }
    }
  }
`;
