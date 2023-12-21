import AnchorLink, {
  AnchorLinkProps
} from "@bmi-digital/components/anchor-link";
import Button from "@bmi-digital/components/button";
import LeadBlock from "@bmi-digital/components/lead-block";
import Section from "@bmi-digital/components/section";
import { microCopy } from "@bmi/microcopies";
import { BLOCKS } from "@contentful/rich-text-types";
import { graphql } from "gatsby";
import React from "react";
import withGTM from "../utils/google-tag-manager";
import Link, { Data as LinkData } from "./Link";
import RichText, { RichTextData, parseReachDataRawFields } from "./RichText";
import { useSiteContext } from "./Site";
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

const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);

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
              <Link component={Button} data={link} variant="opaqueOutlined">
                {link.label}
              </Link>
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
                  <LinksContainer
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
