import React, { useContext } from "react";
import { graphql } from "gatsby";
import Button from "@bmi/button";
import LeadBlock from "@bmi/lead-block";
import Section from "@bmi/section";
import { Document } from "@contentful/rich-text-types";
import { SiteContext } from "./Site";
import RichText from "./RichText";
import { getClickableActionFromUrl, LinkData } from "./Link";
import TableOfContent from "@bmi/table-of-content";

export type Data = {
  __typename: "ContentfulLeadBlockSection";
  title: string;
  text: {
    json: Document;
  };
  link: LinkData | null;
  postItCard: {
    json: Document;
  } | null;
};

const LeadBlockSection = ({
  data: { title, text, link, postItCard }
}: {
  data: Data;
}) => {
  const { countryCode, getMicroCopy } = useContext(SiteContext);

  return (
    <Section backgroundColor="white">
      <LeadBlock>
        <LeadBlock.Content>
          <LeadBlock.Content.Section>
            <Section.Title>{title}</Section.Title>
            {text && <RichText document={text.json} />}
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
        <LeadBlock.Card theme="pearl">
          <LeadBlock.Card.Section>
            {postItCard ? (
              <RichText
                document={postItCard.json}
                backgroundTheme="dark"
                underlineHeadings={["h2", "h3", "h4"]}
              />
            ) : (
              <>
                <LeadBlock.Card.Heading hasUnderline>
                  {getMicroCopy("page.jumpToSection")}
                </LeadBlock.Card.Heading>
                <LeadBlock.Card.Content>
                  <TableOfContent.Menu />
                </LeadBlock.Card.Content>
              </>
            )}
          </LeadBlock.Card.Section>
        </LeadBlock.Card>
      </LeadBlock>
    </Section>
  );
};

export default LeadBlockSection;

export const query = graphql`
  fragment LeadBlockSectionFragment on ContentfulLeadBlockSection {
    title
    text {
      json
    }
    link {
      ...LinkFragment
    }
    postItCard {
      json
    }
  }
`;
