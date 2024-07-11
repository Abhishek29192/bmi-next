import Section from "@bmi-digital/components/section";
import { replaceSpaces } from "@bmi-digital/components/utils";
import React from "react";
import RichText from "./RichText";
import { Data as TitleWithContentData } from "./TitleWithContent";
import { GridContainer, classes } from "./styles/TitleWithContentSectionStyles";

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
