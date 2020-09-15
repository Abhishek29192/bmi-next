import React from "react";
import Accordion from "@bmi/accordion";
import Section from "@bmi/section";
import Tabs from "@bmi/tabs";
import Typography from "@bmi/typography";
import { graphql } from "gatsby";
import {
  TabsOrAccordionSectionData,
  TabsOrAccordionSectionItemData
} from "../templates/types";

const SectionAccordion = ({
  items
}: {
  items: TabsOrAccordionSectionItemData[];
}) => {
  return (
    <Accordion>
      {items.map(({ title, content }) => {
        return (
          <Accordion.Item key={title}>
            <Accordion.Summary>
              {/* @ts-ignore Accepts component property although not reflected in TS */}
              <Typography component="h3" variant="h6">
                {title}
              </Typography>
            </Accordion.Summary>
            <Accordion.Details>{content}</Accordion.Details>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
};

const SectionTabs = ({
  items
}: {
  items: TabsOrAccordionSectionItemData[];
}) => {
  return (
    <Tabs initialValue={items[0].title}>
      {items.map(({ title, content }) => {
        return (
          <Tabs.TabPanel heading={title} index={title} key={title}>
            {content}
          </Tabs.TabPanel>
        );
      })}
    </Tabs>
  );
};

const TabsOrAccordionSection = (data: TabsOrAccordionSectionData) => {
  const { title, type, items, description } = data;
  return (
    <Section>
      <Section.Title>{title}</Section.Title>
      {description && <Typography variant="body1">{description}</Typography>}
      {type === "Accordion" && <SectionAccordion items={items} />}
      {type === "Tabs" && <SectionTabs items={items} />}
    </Section>
  );
};

export default TabsOrAccordionSection;

export const query = graphql`
  fragment TabsOrAccordionSectionFragment on ContentfulTabsOrAccordionSection {
    type
    title
    items {
      title
    }
  }
`;
