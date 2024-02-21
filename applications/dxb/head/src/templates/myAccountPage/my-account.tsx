import { graphql } from "gatsby";
import React from "react";
import Page from "../../components/Page";
import Protected from "../../pages/protected";
import Hero, { HeroProps } from "./Hero";
import ServiceSupportSection from "./ServiceSupportSection";
import ToolSection from "./ToolSection";
import type { ServiceSupportSectionProps } from "./ServiceSupportSection";
import type { ToolSectionProps } from "./ToolSection";
import type { Data as SiteData } from "../../components/Site";

export type AccountPage = ToolSectionProps &
  ServiceSupportSectionProps &
  HeroProps & {
    path: string;
  };

export type SiteDataWithAccountPage = Omit<SiteData, "accountPage"> & {
  accountPage: AccountPage;
};

type Props = {
  data: {
    contentfulSite: SiteDataWithAccountPage;
  };
};

const MyAccountPage = ({ data }: Props) => {
  const {
    featuredMedia,
    salutation,
    roleDescription,
    description,
    titleForToolSection,
    titleForServiceSupportSection,
    serviceSupportCards,
    slug,
    allowTools,
    path
  } = data.contentfulSite.accountPage;

  return (
    <Protected>
      <Page
        title="My acc page"
        pageData={{
          breadcrumbs: null,
          signupBlock: null,
          seo: null,
          path
        }}
        siteData={data.contentfulSite}
      >
        <Hero
          salutation={salutation}
          roleDescription={roleDescription}
          featuredMedia={featuredMedia}
          slug={slug}
          description={description}
        />
        <ToolSection
          titleForToolSection={titleForToolSection}
          allowTools={allowTools}
        />
        <ServiceSupportSection
          titleForServiceSupportSection={titleForServiceSupportSection}
          serviceSupportCards={serviceSupportCards}
        />
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
        roleDescription
        description
        titleForToolSection
        titleForServiceSupportSection
        allowTools
        serviceSupportCards {
          ...ContactDetailsFragment
        }
        path
      }
    }
  }
`;
