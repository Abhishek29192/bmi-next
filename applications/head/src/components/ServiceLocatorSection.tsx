import React from "react";
import { graphql } from "gatsby";
import RichText, { RichTextData } from "./RichText";
import Section from "@bmi/section";

export type Data = {
  __typename: "ContentfulServiceLocatorSection";
  title: string;
  label: string;
  body: RichTextData | null;
};

const ServiceLocatorSection = ({ data }: { data: Data }) => {
  const { label, body } = data;

  return (
    <Section backgroundColor="white">
      <Section.Title>{label}</Section.Title>
      {body && <RichText document={body} />}
    </Section>
  );
};

export default ServiceLocatorSection;

export const query = graphql`
  fragment ServiceLocatorSectionFragment on ContentfulServiceLocatorSection {
    __typename
    title
    label
    body {
      ...RichTextFragment
    }
  }
`;
