import React from "react";
import { graphql } from "gatsby";
import Accordion from "@bmi/accordion";
import Section from "@bmi/section";
import Tabs from "@bmi/tabs";
import Typography from "@bmi/typography";
import RichText from "../components/RichText";
import { Data as TitleWithContentData } from "./TitleWithContent";

export type Data = {
  __typename: "ContentfulTabsOrAccordionSection";
  title: string;
  description: null | { description: string };
  items: readonly TitleWithContentData[];
  type: "Accordion" | "Tabs";
};

const SectionAccordion = ({
  items
}: {
  items: readonly TitleWithContentData[];
}) => {
  return (
    <Accordion>
      {items.map(({ title, content }) => {
        return (
          <Accordion.Item key={title}>
            <Accordion.Summary>
              <Typography component="h3" variant="h6">
                {title}
              </Typography>
            </Accordion.Summary>
            <Accordion.Details>
              <RichText document={content} />
            </Accordion.Details>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
};

const SectionTabs = ({ items }: { items: readonly TitleWithContentData[] }) => {
  return (
    <Tabs theme="primary" initialValue={items[0].title}>
      {items.map(({ title, content }) => {
        return (
          <Tabs.TabPanel heading={title} index={title} key={title}>
            <RichText document={content} />
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

const TabsOrAccordionSection = ({ data }: { data: Data }) => {
  if (!data) {
    return null;
  }

  const { title, type, items, description } = data;
  const backgroundColor = type === "Tabs" ? "pearl" : "white";
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
    __typename
    type
    title
    description {
      description
    }
    items {
      ...TitleWithContentFragment
    }
  }
`;
