import resolveRichText from "./ContentfulRichText";
import type { Data as IframeSectionData } from "../../components/IframeSection";
import type { ContentfulIframeSectionData } from "./types/IframeSection";

const resolveIframeSection = async ({
  summary,
  ...rest
}: ContentfulIframeSectionData): Promise<IframeSectionData> => ({
  ...rest,
  summary: summary ? await resolveRichText(summary) : null
});

export default resolveIframeSection;
