import React from "react";
import { graphql } from "gatsby";
import { Button } from "@bmi/components";
import { LeadBlock } from "@bmi/components";
import { Section } from "@bmi/components";
import { TableOfContent } from "@bmi/components";
import { AnchorLink, AnchorLinkProps } from "@bmi/components";
import { BLOCKS } from "@contentful/rich-text-types";
import { microCopy } from "../constants/microCopies";
import withGTM from "../utils/google-tag-manager";
import { useSiteContext } from "./Site";
import RichText, { RichTextData, parseReachDataRawFields } from "./RichText";
import Link, { Data as LinkData } from "./Link";

export type Data = {
  __typename: "ContentfulLeadBlockSection";
  title: string;
  text: RichTextData;
  link: LinkData | null;
  postItCard: RichTextData | null;
};

const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);

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
                gtmLabel={
                  parseReachDataRawFields(postItCard)[BLOCKS.HEADING_4] ||
                  parseReachDataRawFields(postItCard)[BLOCKS.HEADING_5]
                }
              />
            ) : (
              <>
                <LeadBlock.Card.Heading hasUnderline>
                  {getMicroCopy(microCopy.PAGE_JUMP_TO_SECTION)}
                </LeadBlock.Card.Heading>
                <LeadBlock.Card.Content>
                  <TableOfContent.Menu
                    anchorLinkComponent={(props: AnchorLinkProps) => (
                      <GTMAnchorLink
                        gtm={{
                          id: "cta-click1",
                          label: `${getMicroCopy(
                            microCopy.PAGE_JUMP_TO_SECTION
                          )} - ${props.children}`,
                          action: props.action?.href
                        }}
                        {...props}
                      />
                    )}
                  />
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
