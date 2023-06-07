import { Container, Grid, Tabs } from "@bmi-digital/components";
import { Tab, TabProps } from "@mui/material";
import classnames from "classnames";
import { graphql } from "gatsby";
import React from "react";
import RichText, { RichTextData } from "../components/RichText";
import TeamList, { Data as TeamMemberData } from "../components/TeamList";
import withGTM from "../utils/google-tag-manager";
import { StyledSection, Title, classes } from "./styles/TeamSectionStyles";

export type Data = {
  __typename: "ContentfulTeamSection";
  title: string;
  teamCategories: {
    title: string;
    description: RichTextData | null;
    team_member: TeamMemberData | null;
  }[];
  backgroundColor: "Alabaster" | "White" | null;
};

type Props = {
  data: Data;
  className?: string;
};

const GTMTab = withGTM<TabProps>(Tab, {
  label: "label"
});

const TeamSection = ({ data, className }: Props) => {
  return (
    <StyledSection
      className={classnames(
        className,
        classes[data.backgroundColor?.toLowerCase() || "white"]
      )}
    >
      <Grid container spacing={3}>
        <Grid xs={12}>
          {data.title && <Title>{data.title}</Title>}
          <Tabs
            component={Container}
            className={classes.tabs}
            tabComponent={(props: TabProps) => (
              <GTMTab
                gtm={{ id: "selector-tabs2", action: "Selector - Tabs" }}
                {...props}
              />
            )}
          >
            {data.teamCategories.map((category, index) => (
              <Tabs.TabPanel
                className={classes.tabPanel}
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
                  {category.team_member ? (
                    <TeamList data={category.team_member} />
                  ) : null}
                </Container>
              </Tabs.TabPanel>
            ))}
          </Tabs>
        </Grid>
      </Grid>
    </StyledSection>
  );
};

export default TeamSection;

export const query = graphql`
  fragment TeamSectionFragment on ContentfulTeamSection {
    __typename
    title
    teamCategories {
      title
      description {
        ...RichTextFragment
      }
      team_member {
        ...TeamMemberFragment
      }
    }
    backgroundColor
  }
`;
