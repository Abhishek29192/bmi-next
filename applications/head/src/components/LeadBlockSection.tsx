import React, { useContext } from "react";
import { graphql } from "gatsby";
import Button from "@bmi/button";
import LeadBlock from "@bmi/lead-block";
import Section from "@bmi/section";
import { Document } from "@contentful/rich-text-types";
import { SiteContext } from "./Site";
import PostItCard, { Data as PostItCardSectionData } from "./PostItCard";
import RichText from "./RichText";
import { getClickableActionFromUrl, LinkData } from "./Link";

export type Data = {
  __typename: "ContentfulLeadBlockSection";
  text: {
    json: Document;
  };
  link?: LinkData;
  cardTheme: "pearl" | "blue-900";
  cardSections: PostItCardSectionData[];
};

const LeadBlockSection = ({
  data: {
    text: { json },
    link,
    cardTheme,
    cardSections
  }
}: {
  data: Data;
}) => {
  const { countryCode } = useContext(SiteContext);

  return (
    <Section backgroundColor="white">
      <LeadBlock>
        <LeadBlock.Content>
          <LeadBlock.Content.Section>
            <RichText document={json} />
          </LeadBlock.Content.Section>
          {link && (
            <LeadBlock.Content.Section>
              <Button
                action={getClickableActionFromUrl(
                  link.linkedPage,
                  link.url,
                  countryCode
                )}
              >
                {link.label}
              </Button>
            </LeadBlock.Content.Section>
          )}
        </LeadBlock.Content>
        <PostItCard
          Component={LeadBlock.Card}
          cardTheme={cardTheme}
          cardSections={cardSections}
        />
      </LeadBlock>
    </Section>
  );
};

export default LeadBlockSection;

export const query = graphql`
  fragment LeadBlockSectionFragment on ContentfulLeadBlockSection {
    text {
      json
    }
    link {
      ...LinkFragment
    }
    cardTheme
    cardSections {
      ... on ContentfulPostItCardSection {
        ...PostItCardSectionFragment
      }
    }
  }
`;
