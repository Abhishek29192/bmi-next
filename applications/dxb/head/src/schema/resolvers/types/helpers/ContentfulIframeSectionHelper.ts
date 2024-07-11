import createContentfulRichText from "./ContentfulRichText";
import type { ContentfulIframeSectionData } from "../IframeSection";

const createContentfulIframeSection = (
  iframeData?: Partial<ContentfulIframeSectionData>
): ContentfulIframeSectionData => ({
  __typename: "Iframe",
  title: "Iframe section",
  summary: createContentfulRichText(),
  url: "iframe-url",
  height: "1000",
  allowCookieClasses: [],
  ...iframeData
});

export default createContentfulIframeSection;
