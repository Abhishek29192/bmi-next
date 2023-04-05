import { replaceSpaces, Section } from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
import { Data as TitleWithContentData } from "./TitleWithContent";
import { GridContainer, classes } from "./styles/TitleWithContentSectionStyles";
import RichText from "./RichText";

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
      <GridContainer container lg={8} xs={12}>
        {data.title && <Section.Title>{data.title}</Section.Title>}
        <RichText
          document={data.content}
          hasNoBottomMargin
          className={classes.richText}
        />
      </GridContainer>
    </Section>
  );
};

export default TitleWithContentSection;

export const query = graphql`
  fragment TitleWithContentSectionFragment on ContentfulTitleWithContent {
    ...TitleWithContentFragment
  }
`;
