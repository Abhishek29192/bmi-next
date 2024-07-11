import createContentfulLeadBlock from "../types/helpers/ContentfulLeadBlockHelper";
import resolveLeadBlock from "../ContentfulLeadBlock";
import createContentfulRichText from "../types/helpers/ContentfulRichText";
import createContentfulLink from "../types/helpers/ContentfulLinkHelper";
import type { ContentfulRichText } from "../types/RichText";
import type { ContentfulLink } from "../types/Link";

const richTextResolverMock = jest.fn();
jest.mock("../ContentfulRichText", () => ({
  __esModule: true,
  default: (richText: ContentfulRichText) => richTextResolverMock(richText)
}));

const linkResolverMock = jest.fn();
jest.mock("../ContentfulLink", () => ({
  __esModule: true,
  default: (link: ContentfulLink) => linkResolverMock(link)
}));

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  richTextResolverMock.mockResolvedValue("resolved-rich-text");
  linkResolverMock.mockResolvedValue("resolved-link");
});

describe("ContentfulLeadBlock resolver", () => {
  it("should not call link resolved if link is not provided", async () => {
    const resolvedLeadBlock = await resolveLeadBlock(
      createContentfulLeadBlock({ link: null })
    );
    expect(linkResolverMock).not.toHaveBeenCalled();
    expect(resolvedLeadBlock.link).toBeNull();
  });

  it("should not call rich text resolver for postItCard if not provided", async () => {
    const resolvedLeadBlock = await resolveLeadBlock(
      createContentfulLeadBlock({
        text: createContentfulRichText(),
        postItCard: null
      })
    );
    //Rich text resolver is being called by text field as it is a required field
    expect(richTextResolverMock).toHaveBeenCalledTimes(1);
    expect(resolvedLeadBlock.postItCard).toBeNull();
  });

  it("returns correct data if all the allowed fields provided", async () => {
    const leadBlockData = createContentfulLeadBlock({
      __typename: "LeadBlockSection",
      title: "Title",
      link: createContentfulLink(),
      postItCard: createContentfulRichText(),
      text: createContentfulRichText()
    });

    expect(await resolveLeadBlock(leadBlockData)).toEqual({
      __typename: "LeadBlockSection",
      title: "Title",
      link: "resolved-link",
      text: "resolved-rich-text",
      postItCard: "resolved-rich-text"
    });
    expect(linkResolverMock).toHaveBeenCalledWith(leadBlockData.link);
    expect(richTextResolverMock).toHaveBeenCalledWith(leadBlockData.text);
    expect(richTextResolverMock).toHaveBeenCalledWith(leadBlockData.postItCard);
  });
});
