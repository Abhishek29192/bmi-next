import React from "react";
import { graphql } from "gatsby";
import { Button } from "@bmi-digital/components";
import { LeadBlock } from "@bmi-digital/components";
import { Section } from "@bmi-digital/components";
import { TableOfContent } from "@bmi-digital/components";
import { microCopy } from "../constants/microCopies";
import { useSiteContext } from "./Site";
import RichText, { RichTextData } from "./RichText";
import Link, { Data as LinkData } from "./Link";

export type Data = {
  __typename: "ContentfulLeadBlockSection";
  title: string;
  text: RichTextData;
  link: LinkData | null;
  postItCard: RichTextData | null;
};

const LeadBlockSection = ({
  data: { text, link, postItCard }
}: {
  data: Data;
}) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <Section backgroundColor="white">
      <LeadBlock>
        <LeadBlock.Content>
          <LeadBlock.Content.Section>
            {text && (
              <RichText
                document={text}
                underlineHeadings={["h2", "h3", "h4"]}
              />
            )}
          </LeadBlock.Content.Section>
          {link && (
            <LeadBlock.Content.Section>
              <Link component={Button} data={link}>
                {link.label}
              </Link>
            </LeadBlock.Content.Section>
          )}
        </LeadBlock.Content>
        <LeadBlock.Card theme="pearl">
          <LeadBlock.Card.Section>
            {postItCard ? (
              <RichText
                document={postItCard}
                underlineHeadings={["h2", "h3", "h4"]}
              />
            ) : (
              <>
                <LeadBlock.Card.Heading hasUnderline>
                  {getMicroCopy(microCopy.PAGE_JUMP_TO_SECTION)}
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
      ...RichTextFragment
    }
    link {
      ...LinkFragment
    }
    postItCard {
      ...RichTextFragment
    }
  }
`;
