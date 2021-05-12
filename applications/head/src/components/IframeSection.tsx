// import { Document } from "@contentful/rich-text-types";
import React from "react";
import { graphql } from "gatsby";
import Grid from "@bmi/grid";
import Section from "@bmi/section";

export type Data = {
  __typename: "ContentfulIframe";
  title: string | null;
  url: string;
  height: string;
};
type Props = {
  data: Data;
};

const IframeSection = ({ data }: Props) => {
  return (
    <Section backgroundColor="white">
      <Grid container item lg={8} xs={12}>
        {data.title && <Section.Title>{data.title}</Section.Title>}
        <iframe
          src={data.url}
          width="100%"
          height={data.height}
          style={{ border: 0 }}
        ></iframe>
      </Grid>
    </Section>
  );
};

export default IframeSection;

export const query = graphql`
  fragment IframeSectionFragment on ContentfulIframe {
    title
    url
    height
  }
`;
