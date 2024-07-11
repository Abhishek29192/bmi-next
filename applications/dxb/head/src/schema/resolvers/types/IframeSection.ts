import type { Data as IframeSectionData } from "../../../components/IframeSection";
import type { ContentfulRichText } from "./RichText";

export type ContentfulIframeSectionData = Omit<IframeSectionData, "summary"> & {
  summary: ContentfulRichText | null;
};
