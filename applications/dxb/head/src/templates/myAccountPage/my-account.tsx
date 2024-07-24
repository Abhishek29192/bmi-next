import { graphql } from "gatsby";
import React from "react";
import Page from "../../components/Page";
import Protected from "../../pages/protected";
import { updateBreadcrumbTitleFromContentful } from "../../utils/breadcrumbUtils";
import Hero from "./Hero";
import ServiceSupportSection from "./ServiceSupportSection";
import ToolSection from "./ToolSection";
import type { SiteDataWithAccountPage } from "./types";

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
    globalTools,
    tools,
    path
  } = data.contentfulSite.accountPage;

  const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
    breadcrumbs,
    breadcrumbTitle
  );
  return (
    <Protected isPageProtected>
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
          globalTools={globalTools}
          path={path}
          tools={tools}
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
        globalTools
        tools {
          ...AccountToolFragment
        }
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
