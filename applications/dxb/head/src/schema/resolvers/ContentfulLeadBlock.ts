import resolveRichText from "./ContentfulRichText";
import resolveLink from "./ContentfulLink";
import type { Data as LeadBlockData } from "../../components/LeadBlockSection";
import type { ContentfulLeadBlock } from "./types/LeadBlock";

const resolveLeadBlock = async ({
  postItCard,
  text,
  link,
  ...rest
}: ContentfulLeadBlock): Promise<LeadBlockData> => ({
  ...rest,
  link: link ? await resolveLink(link) : null,
  text: await resolveRichText(text),
  postItCard: postItCard ? await resolveRichText(postItCard) : null
});

export default resolveLeadBlock;
