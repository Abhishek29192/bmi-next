import resolveIframeSection from "../ContentfulIframeSection";
import createContentfulIframeSection from "../types/helpers/ContentfulIframeSectionHelper";
import createContentfulRichText from "../types/helpers/ContentfulRichText";
import type { ContentfulRichText } from "../types/RichText";

const richTextResolverMock = jest.fn();
jest.mock("../ContentfulRichText", () => ({
  __esModule: true,
  default: (richText: ContentfulRichText) => richTextResolverMock(richText)
}));

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  richTextResolverMock.mockResolvedValue("resolved-rich-text");
});

describe("ContentfulIframeSection resolver", () => {
  it("returns correct data if all the allowed fields provided", async () => {
    const iframeSectionData = createContentfulIframeSection({
      __typename: "Iframe",
      title: "Iframe section",
      summary: createContentfulRichText(),
      url: "iframe-url",
      height: "1000",
      allowCookieClasses: []
    });

    expect(await resolveIframeSection(iframeSectionData)).toEqual({
      __typename: "Iframe",
      title: "Iframe section",
      summary: "resolved-rich-text",
      url: "iframe-url",
      height: "1000",
      allowCookieClasses: []
    });
    expect(richTextResolverMock).toHaveBeenCalledWith(
      iframeSectionData.summary
    );
  });

  it("should not call rich text resolver if summary is not provided", async () => {
    const resolvedIframeSection = await resolveIframeSection(
      createContentfulIframeSection({ summary: null })
    );
    expect(richTextResolverMock).not.toHaveBeenCalled();
    expect(resolvedIframeSection.summary).toBeNull();
  });
});
