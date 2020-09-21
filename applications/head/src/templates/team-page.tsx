import React from "react";
import Page from "../components/Page";
import { graphql } from "gatsby";
import { SiteData, TeamPageData } from "./types";
import TeamList from "../components/TeamList";
import Tabs from "@bmi/tabs";
import Container from "@bmi/container/src";
import RichText from "../components/RichText";

type Props = {
  data: {
    contentfulTeamPage: TeamPageData;
    contentfulSite: SiteData;
  };
};

const TeamPage = ({ data }: Props) => {
  const { teamCategories, ...pageData } = data.contentfulTeamPage;
  return (
    <Page pageData={pageData} siteData={data.contentfulSite}>
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
        title
        subtitle {
          subtitle
        }
        image {
          title
          file {
            fileName
            url
          }
        }
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
      countryCode
      footerMainNavigation {
        ...FooterMainNavigationFragment
      }
      footerSecondaryNavigation {
        ...FooterSecondaryNavigationFragment
      }
      menuNavigation {
        ...HeaderNavigationFragment
      }
      menuUtilities {
        ...HeaderUtilitiesFragment
      }
      ...SignUpFragment
    }
  }
`;
