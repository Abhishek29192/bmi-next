import React from "react";
import { graphql } from "gatsby";
import Tabs from "@bmi/tabs";
import Container from "@bmi/container";
import Section from "@bmi/section";
import Hero from "@bmi/hero";
import { Tab, TabProps } from "@material-ui/core";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../components/Breadcrumbs";
import { Data as SiteData } from "../components/Site";
import Page, { Data as PageData } from "../components/Page";
import { Data as PageInfoData } from "../components/PageInfo";
import TeamList, { Data as TeamMemberData } from "../components/TeamList";
import RichText, { RichTextData } from "../components/RichText";
import withGTM from "../utils/google-tag-manager";

type Data = PageInfoData &
  PageData & {
    __typename: "ContentfulTeamPage";
    teamCategories: {
      title: string;
      description: RichTextData | null;
      // NOTE: This is snake_case because it's a relationship field.
      team_member: TeamMemberData;
    }[];
    breadcrumbs: BreadcrumbsData;
  };

type Props = {
  data: {
    contentfulTeamPage: Data;
    contentfulSite: SiteData;
  };
  pageContext: {
    variantCodeToPathMap: Record<string, string>;
  };
};

const TeamPage = ({ data, pageContext }: Props) => {
  const { brandLogo, title, teamCategories, inputBanner, breadcrumbs, seo } =
    data.contentfulTeamPage;
  const pageData: PageData = {
    breadcrumbs,
    inputBanner,
    seo
  };

  const GTMTab = withGTM<TabProps>(Tab, {
    label: "label"
  });

  return (
    <Page
      brand={brandLogo}
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
    >
      <Hero
        level={2}
        title={title}
        brand={brandLogo}
        breadcrumbs={<Breadcrumbs data={breadcrumbs} isDarkThemed />}
      />
      <Tabs
        theme="secondary"
        component={Container}
        tabComponent={(props: TabProps) => (
          <GTMTab
            gtm={{ id: "selector-tabs2", action: "Selector – Tabs" }}
            {...props}
          />
        )}
      >
        {teamCategories.map((category, index) => (
          <Tabs.TabPanel
            key={`category-tab-${index}`}
            heading={category.title}
            index={index}
          >
            <Container style={{ paddingBottom: "60px" }}>
              {category.description ? (
                <div style={{ marginBottom: "60px" }}>
                  <RichText document={category.description} />
                </div>
              ) : null}
              <TeamList data={category.team_member} />
            </Container>
          </Tabs.TabPanel>
        ))}
      </Tabs>
      <Section backgroundColor="alabaster" isSlim>
        <Breadcrumbs data={breadcrumbs} />
      </Section>
    </Page>
  );
};

export default TeamPage;

export const pageQuery = graphql`
  query TeamPageById($pageId: String!, $siteId: String!) {
    contentfulTeamPage(id: { eq: $pageId }) {
      title
      brandLogo
      # Check length allowed and define right field type
      teamCategories {
        title
        description {
          ...RichTextFragment
        }
        team_member {
          ...TeamMemberFragment
        }
      }
      ...PageFragment
      ...BreadcrumbsFragment
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
