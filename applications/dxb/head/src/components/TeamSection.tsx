import {
  Container,
  Grid,
  Section,
  SectionBackgroundColor,
  Tabs
} from "@bmi-digital/components";
import { Tab, TabProps } from "@material-ui/core";
import classnames from "classnames";
import { graphql } from "gatsby";
import React from "react";
import RichText, { RichTextData } from "../components/RichText";
import TeamList, { Data as TeamMemberData } from "../components/TeamList";
import withGTM from "../utils/google-tag-manager";
import styles from "./styles/TeamSection.module.scss";

export type Data = {
  __typename: "ContentfulTeamSection";
  title: string;
  teamCategories: {
    title: string;
    description: RichTextData | null;
    team_member: TeamMemberData;
  }[];
  backgroundColor?: SectionBackgroundColor;
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
    <Section
      className={classnames(
        className,
        styles[`team-section-${data.backgroundColor?.toLowerCase() || "white"}`]
      )}
    >
      <Grid container spacing={3} className={styles["grid"]}>
        <Grid item xs={12}>
          {data.title && (
            <Section.Title className={styles["title"]}>
              {data.title}
            </Section.Title>
          )}
          <Tabs
            component={Container}
            className={styles["tabs"]}
            tabComponent={(props: TabProps) => (
              <GTMTab
                gtm={{ id: "selector-tabs2", action: "Selector – Tabs" }}
                {...props}
              />
            )}
          >
            {data.teamCategories.map((category, index) => (
              <Tabs.TabPanel
                className={styles["tab-panel"]}
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
        </Grid>
      </Grid>
    </Section>
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
