import Container from "@bmi-digital/components/container";
import Grid from "@bmi-digital/components/grid";
import Section from "@bmi-digital/components/section";
import Tabs from "@bmi-digital/components/tabs";
import Tab, { TabProps } from "@mui/material/Tab";
import classnames from "classnames";
import { graphql } from "gatsby";
import React from "react";
import TeamList, { Data as TeamMemberData } from "../components/TeamList";
import { useConfig } from "../contexts/ConfigProvider";
import withGTM from "../utils/google-tag-manager";
import RichText, { RichTextData } from "./RichText";
import {
  StyledSection,
  TeamCategoryContainer,
  classes
} from "./styles/TeamSectionStyles";

export type TeamCategoryType = {
  id: string;
  title: string;
  description: RichTextData | null;
  team_member: TeamMemberData | null;
};

export type Data = {
  __typename: "ContentfulTeamSection";
  title: string;
  teamCategories: TeamCategoryType[];
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
  const { renderTeamCategoriesAsRows } = useConfig();

  return (
    <StyledSection
      className={classnames(
        className,
        classes[data.backgroundColor?.toLowerCase() || "white"]
      )}
    >
      <Grid container spacing={3}>
        <Grid xs={12}>
          {data.title && (
            <Section.Title variant="h2" hasUnderline>
              {data.title}
            </Section.Title>
          )}
          {!renderTeamCategoriesAsRows ? (
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
                  key={index}
                  heading={category.title}
                  index={index}
                >
                  <Container>
                    <TeamCategorySection
                      title={category.title}
                      description={category.description}
                      team_member={category.team_member}
                    />
                  </Container>
                </Tabs.TabPanel>
              ))}
            </Tabs>
          ) : (
            data.teamCategories.map((category, index) => (
              <TeamCategorySection
                key={category.id}
                title={category.title}
                description={index === 0 && category.description}
                team_member={category.team_member}
              />
            ))
          )}
        </Grid>
      </Grid>
    </StyledSection>
  );
};

const TeamCategorySection = (props: Omit<TeamCategoryType, "id">) => (
  <TeamCategoryContainer>
    {props.description && (
      <RichText
        document={props.description}
        className={classes.description}
        hasNoBottomMargin
      />
    )}
    {props.team_member && <TeamList data={props.team_member} />}
  </TeamCategoryContainer>
);

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
