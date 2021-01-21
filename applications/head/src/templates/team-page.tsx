import React from "react";
import { graphql } from "gatsby";
import Tabs from "@bmi/tabs";
import Container from "@bmi/container";
import Section from "@bmi/section";
import Breadcrumbs from "../components/Breadcrumbs";
import { Data as SiteData } from "../components/Site";
import Hero from "@bmi/hero";
import Page, { Data as PageData } from "../components/Page";
import { Data as PageInfoData } from "../components/PageInfo";
import TeamList, { Data as TeamMemberData } from "../components/TeamList";
import RichText, { RichTextData } from "../components/RichText";

type Data = PageInfoData &
  PageData & {
    __typename: "ContentfulTeamPage";
    teamCategories: {
      title: string;
      description: RichTextData | null;
      // NOTE: This is snake_case because it's a relationship field.
      team_member: TeamMemberData;
    }[];
  };

type Props = {
  data: {
    contentfulTeamPage: Data;
    contentfulSite: SiteData;
  };
};

const TeamPage = ({ data }: Props) => {
  const { title, teamCategories, slug, inputBanner } = data.contentfulTeamPage;
  const pageData: PageData = {
    slug,
    inputBanner
  };

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      <Hero
        level={2}
        title={title}
        breadcrumbs={
          <Breadcrumbs
            title={title}
            slug={slug}
            menuNavigation={data.contentfulSite.menuNavigation}
            isDarkThemed
          />
        }
      />
      <Tabs theme="secondary" component={Container}>
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
        <Breadcrumbs
          title={title}
          slug={slug}
          menuNavigation={data.contentfulSite.menuNavigation}
        />
      </Section>
    </Page>
  );
};

export default TeamPage;

export const pageQuery = graphql`
  query TeamPageById($pageId: String!, $siteId: String!) {
    contentfulTeamPage(id: { eq: $pageId }) {
      title
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
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
