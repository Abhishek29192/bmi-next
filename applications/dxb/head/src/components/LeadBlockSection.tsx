import AnchorLink, {
  AnchorLinkProps
} from "@bmi-digital/components/anchor-link";
import LeadBlock from "@bmi-digital/components/lead-block";
import Section from "@bmi-digital/components/section";
import { microCopy } from "@bmi/microcopies";
import { BLOCKS } from "@contentful/rich-text-types";
import { graphql } from "gatsby";
import React from "react";
import { replaceSpaces } from "@bmi-digital/components/utils";
import RichText, { RichTextData, parseRichDataRawFields } from "./RichText";
import { useSiteContext } from "./Site";
import ButtonLink from "./link/ButtonLink";
import { Data as LinkData } from "./link/types";
import {
  LeadBlockWrapper,
  LinkWrapper,
  LinksContainer,
  Text
} from "./styles/leadBlockSectionStyles";

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
    <Section
      backgroundColor="white"
      spacing="none"
      data-testid={`lead-block-section`}
    >
      <LeadBlockWrapper>
        <LeadBlock.Content>
          <Text>
            {text && (
              <RichText
                document={text}
                underlineHeadings={["h2", "h3", "h4"]}
                hasNoBottomMargin
              />
            )}
          </Text>
          {link && (
            <LinkWrapper>
              <ButtonLink
                data={link}
                variant="opaqueOutlined"
                data-testid={`anchor-link-${replaceSpaces(link.label)}`}
              >
                {link.label}
              </ButtonLink>
            </LinkWrapper>
          )}
        </LeadBlock.Content>
        <LeadBlock.Card color="pearl" data-testid="lead-block-card">
          <LeadBlock.Card.Section>
            {postItCard ? (
              <RichText
                document={postItCard}
                underlineHeadings={["h2", "h3", "h4"]}
                gtmLabel={
                  parseRichDataRawFields(postItCard)[BLOCKS.HEADING_4] ||
                  parseRichDataRawFields(postItCard)[BLOCKS.HEADING_5]
                }
              />
            ) : (
              <>
                <LeadBlock.Card.Heading hasUnderline>
                  {getMicroCopy(microCopy.PAGE_JUMP_TO_SECTION)}
                </LeadBlock.Card.Heading>
                <LeadBlock.Card.Content>
                  <LinksContainer
                    anchorLinkComponent={(props: AnchorLinkProps) => (
                      <AnchorLink
                        {...props}
                        gtm={{
                          id: "cta-click1",
                          label: `${getMicroCopy(
                            microCopy.PAGE_JUMP_TO_SECTION
                          )} - ${props.children}`,
                          action: props.href
                        }}
                        data-testid={`anchor-link-${replaceSpaces(
                          getMicroCopy(microCopy.PAGE_JUMP_TO_SECTION)
                        )}`}
                      />
                    )}
                  />
                </LeadBlock.Card.Content>
              </>
            )}
          </LeadBlock.Card.Section>
        </LeadBlock.Card>
      </LeadBlockWrapper>
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
