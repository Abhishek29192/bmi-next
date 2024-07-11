import resolveTitleWithContent from "../ContentfulTitleWithContent";
import createContentfulRichText from "../types/helpers/ContentfulRichText";
import createContentfulTitleWithContent from "../types/helpers/ContentfulTitleWithContent";
import { ContentfulRichText } from "../types/RichText";

const resolveRichTextMock = jest.fn();
jest.mock("../ContentfulRichText", () => ({
  __esModule: true,
  default: (richText: ContentfulRichText) => resolveRichTextMock(richText)
}));

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  resolveRichTextMock.mockResolvedValue("resolved-rich-text");
});

describe("ContentfulTitleWithContent", () => {
  it("returns correct data when all the allowed fields provided", async () => {
    const titleWithContent = createContentfulTitleWithContent({
      __typename: "TitleWithContent",
      name: "Title with content name",
      title: "Title with content title",
      content: createContentfulRichText()
    });

    expect(await resolveTitleWithContent(titleWithContent)).toEqual({
      __typename: "TitleWithContent",
      name: "Title with content name",
      title: "Title with content title",
      content: "resolved-rich-text"
    });
    expect(resolveRichTextMock).toHaveBeenCalledWith(titleWithContent.content);
  });
});
