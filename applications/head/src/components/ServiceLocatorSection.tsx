import React from "react";
import { graphql } from "gatsby";
import RichText, { RichTextData } from "./RichText";
import Section from "@bmi/section";
import { Data as RooferData } from "./Roofer";

export type Data = {
  __typename: "ContentfulServiceLocatorSection";
  title: string;
  label: string;
  body: RichTextData | null;
  roofers: [RooferData];
};

const ServiceLocatorSection = ({ data }: { data: Data }) => {
  const { label, body, roofers } = data;

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
    roofers {
      ...RooferFragment
    }
  }
`;
