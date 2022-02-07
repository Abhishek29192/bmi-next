import React from "react";
import { graphql } from "gatsby";
import Accordion, { AccordionSummaryProps } from "@bmi/accordion";
import Section from "@bmi/section";
import Tabs from "@bmi/tabs";
import Tab, { TabProps } from "@material-ui/core/Tab";
import Typography from "@bmi/typography";
import withGTM from "../utils/google-tag-manager";
import RichText from "../components/RichText";
import { Data as TitleWithContentData } from "./TitleWithContent";

const GTMAccordionSummary = withGTM<AccordionSummaryProps>(Accordion.Summary);

export type Data = {
  __typename: "ContentfulTabsOrAccordionSection";
  title: string | null;
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
            <GTMAccordionSummary
              gtm={{
                id: "selector-accordion1",
                label: title,
                action: "Selector – Accordion"
              }}
            >
              <Typography component="h3" variant="h6">
                {title}
              </Typography>
            </GTMAccordionSummary>
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
  const GTMTab = withGTM<TabProps>(Tab, {
    label: "label"
  });

  return (
    <Tabs
      tabComponent={(props: TabProps) => (
        <GTMTab
          gtm={{ id: "selector-tabs2", action: "Selector – Tabs" }}
          {...props}
        />
      )}
      theme="primary"
      initialValue={items.length > 0 ? items[0].title || items[0].name : null}
    >
      {items.length > 0 &&
        items.map(({ title, content, name }) => {
          const newTitle = title || name;
          return (
            <Tabs.TabPanel heading={newTitle} index={newTitle} key={newTitle}>
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
  // eslint-disable-next-line security/detect-object-injection
  const Component = componentMap[type];

  return (
    <Section backgroundColor={backgroundColor}>
      {title && <Section.Title>{title}</Section.Title>}
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
