// import { Document } from "@contentful/rich-text-types";
import React from "react";
import { graphql } from "gatsby";
import Grid from "@bmi/grid";
import Section from "@bmi/section";
import RichText from "./RichText";
import { Data as TitleWithContentData } from "./TitleWithContent";

export type Data = TitleWithContentData;

type Props = {
  data: Data;
};

const TitleWithContentSection = ({ data }: Props) => {
  return (
    <Section backgroundColor="white">
      <Grid container item lg={8} xs={12}>
        <Section.Title>{data.title}</Section.Title>
        <RichText document={data.content} />
      </Grid>
    </Section>
  );
};

export default TitleWithContentSection;

export const query = graphql`
  fragment TitleWithContentSectionFragment on ContentfulTitleWithContent {
    ...TitleWithContentFragment
  }
`;
