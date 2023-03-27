import { Grid, replaceSpaces, Section } from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
import RichText from "./RichText";
import { Data as TitleWithContentData } from "./TitleWithContent";

export type Data = TitleWithContentData;

type Props = {
  data: Data;
};

const TitleWithContentSection = ({ data }: Props) => {
  return (
    <Section
      backgroundColor="white"
      data-testid={`title-with-content-section-${replaceSpaces(data.title)}`}
    >
      <Grid container lg={8} xs={12} m={0}>
        {data.title && <Section.Title>{data.title}</Section.Title>}
        <RichText document={data.content} hasNoBottomMargin />
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
