import createContentfulRichText from "./ContentfulRichText";
import createContentfulLink from "./ContentfulLinkHelper";
import type { ContentfulLeadBlock } from "../LeadBlock";

const createContentfulLeadBlock = (
  leadBlock?: Partial<ContentfulLeadBlock>
): ContentfulLeadBlock => ({
  __typename: "LeadBlockSection",
  title: "Title",
  link: createContentfulLink(),
  postItCard: createContentfulRichText(),
  text: createContentfulRichText(),
  ...leadBlock
});

export default createContentfulLeadBlock;
