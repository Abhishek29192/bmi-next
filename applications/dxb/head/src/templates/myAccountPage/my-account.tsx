import { graphql } from "gatsby";
import React from "react";
import Page from "../../components/Page";
import Protected from "../../pages/protected";
import { updateBreadcrumbTitleFromContentful } from "../../utils/breadcrumbUtils";
import Hero, { HeroProps } from "./Hero";
import ServiceSupportSection from "./ServiceSupportSection";
import ToolSection from "./ToolSection";
import type { ServiceSupportSectionProps } from "./ServiceSupportSection";
import type { ToolSectionProps } from "./ToolSection";
import type { Data as SiteData } from "../../components/Site";
import type { Data as BreadcrumbsData } from "../../components/Breadcrumbs";

export type AccountPage = {
  title: string;
  breadcrumbTitle: string | null;
  breadcrumbs: BreadcrumbsData;
} & ToolSectionProps &
  Omit<ServiceSupportSectionProps, "serviceSupportCards"> &
  HeroProps & {
    path: string;
    serviceSupportCards:
      | ServiceSupportSectionProps["serviceSupportCards"]
      | null;
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
    title,
    breadcrumbTitle,
    breadcrumbs,
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

  const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
    breadcrumbs,
    breadcrumbTitle
  );
  return (
    <Protected>
      <Page
        title={title}
        pageData={{
          breadcrumbs: enhancedBreadcrumbs,
          signupBlock: null,
          seo: null,
          path
        }}
        siteData={data.contentfulSite}
      >
        <Hero
          breadcrumbs={enhancedBreadcrumbs}
          salutation={salutation}
          roleDescription={roleDescription}
          featuredMedia={featuredMedia}
          slug={slug}
          description={description}
        />
        <ToolSection
          titleForToolSection={titleForToolSection}
          allowTools={allowTools}
          path={path}
        />
        {serviceSupportCards && (
          <ServiceSupportSection
            titleForServiceSupportSection={titleForServiceSupportSection}
            serviceSupportCards={serviceSupportCards}
          />
        )}
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
        title
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
        breadcrumbTitle
        path
        breadcrumbs {
          id
          label
          slug
        }
      }
    }
  }
`;
