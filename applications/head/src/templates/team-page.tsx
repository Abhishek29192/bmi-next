import React from "react";
import { graphql } from "gatsby";
import { Document } from "@contentful/rich-text-types";
import Tabs from "@bmi/tabs";
import Container from "@bmi/container/src";
import { Data as SiteData } from "../components/Site";
import Hero from "@bmi/hero";
import Page, { Data as PageData } from "../components/Page";
import TeamList, { Data as TeamMemberData } from "../components/TeamList";
import RichText from "../components/RichText";

type PageInfoData = {
  title: string;
};

type Data = PageInfoData &
  PageData & {
    teamCategories: {
      title: string;
      description: {
        json: Document;
      };
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
  const { title, teamCategories, ...pageData } = data.contentfulTeamPage;

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      <Hero level={2} title={title} />
      <Tabs theme="secondary" component={Container}>
        {teamCategories.map((category, index) => (
          <Tabs.TabPanel
            key={`category-tab-${index}`}
            heading={category.title}
            index={index}
          >
            <Container>
              <div style={{ margin: "60px 0" }}>
                <RichText document={category.description.json} />
              </div>
              <TeamList data={category.team_member} />
            </Container>
          </Tabs.TabPanel>
        ))}
      </Tabs>
    </Page>
  );
};

export default TeamPage;

export const pageQuery = graphql`
  query TeamPageById($pageId: String!, $siteId: String!) {
    contentfulTeamPage(id: { eq: $pageId }) {
      title
      slug
      # Check length allowed and define right field type
      showSignUpBanner
      teamCategories {
        title
        description {
          json
        }
        team_member {
          ...TeamMemberFragment
        }
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
