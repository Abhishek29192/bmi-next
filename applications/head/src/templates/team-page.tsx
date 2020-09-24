import React from "react";
import { graphql } from "gatsby";
import { Document } from "@contentful/rich-text-types";
import Tabs from "@bmi/tabs";
import Container from "@bmi/container/src";
import { Data as SiteData } from "../components/Site";
import Hero, { Data as HeroData } from "../components/Hero";
import Page, { Data as PageData } from "../components/Page";
import TeamList, { Data as TeamMemberData } from "../components/TeamList";
import RichText from "../components/RichText";

type Data = PageData & {
  hero: HeroData;
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
  const { hero, teamCategories, ...pageData } = data.contentfulTeamPage;
  return (
    <Page pageData={pageData} siteData={data.contentfulSite}>
      <Hero data={[hero]} />
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
      showSignUpBanner
      hero {
        ...HeroFragment
      }
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
