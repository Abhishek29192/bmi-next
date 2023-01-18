import {
  AnchorLink,
  AnchorLinkProps,
  Button,
  LeadBlock,
  Section,
  TableOfContent
} from "@bmi-digital/components";
import { BLOCKS } from "@contentful/rich-text-types";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { graphql } from "gatsby";
import React from "react";
import { microCopy } from "../constants/microCopies";
import { useConfig } from "../contexts/ConfigProvider";
import withGTM from "../utils/google-tag-manager";
import Link, { Data as LinkData } from "./Link";
import RichText, { parseReachDataRawFields, RichTextData } from "./RichText";
import { useSiteContext } from "./Site";

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
  const {
    config: { isSpaEnabled }
  } = useConfig();

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
              <Link
                component={Button}
                data={link}
                endIcon={isSpaEnabled ? <ArrowForwardIcon /> : null}
                variant="opaqueOutlined"
              >
                {link.label}
              </Link>
            </LeadBlock.Content.Section>
          )}
        </LeadBlock.Content>
        <LeadBlock.Card color="pearl">
          <LeadBlock.Card.Section>
            {postItCard ? (
              <RichText
                document={postItCard}
                underlineHeadings={["h2", "h3", "h4"]}
                hyperlinkColor={isSpaEnabled ? "default" : "black"}
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
