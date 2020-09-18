import React from "react";
import { graphql } from "gatsby";
import Accordion from "@bmi/accordion";
import Section from "@bmi/section";
import Tabs from "@bmi/tabs";
import Typography from "@bmi/typography";
import RichText from "../components/RichText";
import { TitleWithContent as TabsOrAccordionSectionItemData } from "../templates/types";

const SectionAccordion = ({
  items
}: {
  items: readonly TabsOrAccordionSectionItemData[];
}) => {
  return (
    <Accordion>
      {items.map(({ title, content }) => {
        const { json } = content;

        return (
          <Accordion.Item key={title}>
            <Accordion.Summary>
              {/* @ts-ignore Accepts component property although not reflected in TS */}
              <Typography component="h3" variant="h6">
                {title}
              </Typography>
            </Accordion.Summary>
            <Accordion.Details>
              <RichText document={json} />
            </Accordion.Details>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
};

const SectionTabs = ({
  items
}: {
  items: readonly TabsOrAccordionSectionItemData[];
}) => {
  return (
    <Tabs initialValue={items[0].title}>
      {items.map(({ title, content }) => {
        const { json } = content;

        return (
          <Tabs.TabPanel heading={title} index={title} key={title}>
            <RichText document={json} />
          </Tabs.TabPanel>
        );
      })}
    </Tabs>
  );
};

const componentMap = {
  Accordion: SectionAccordion,
  Tabs: SectionTabs
};

type TabsOrAccordion = {
  backgroundColor: "pearl" | "white";
  description?: { description: string };
  items: readonly TabsOrAccordionSectionItemData[];
  title: React.ReactNode;
  type: "Accordion" | "Tabs";
};

const TabsOrAccordionSection = ({
  title,
  type,
  items,
  description,
  backgroundColor
}: TabsOrAccordion) => {
  const Component = componentMap[type];
  return (
    <Section backgroundColor={backgroundColor}>
      <Section.Title>{title}</Section.Title>
      {description && (
        <Typography variant="body1">{description.description}</Typography>
      )}
      <div style={{ marginTop: "40px" }}>
        <Component items={items} />
      </div>
    </Section>
  );
};

export default TabsOrAccordionSection;

export const query = graphql`
  fragment TabsOrAccordionSectionFragment on ContentfulTabsOrAccordionSection {
    type
    title
    description {
      description
    }
    items {
      title
      content {
        json
      }
    }
  }
`;
