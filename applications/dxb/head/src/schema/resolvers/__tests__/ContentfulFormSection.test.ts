import resolveFormSection from "../ContentfulFormSection";
import createContentfulFormSectionData from "../types/helpers/ContentfulFormSectionHelper";
import { ContentfulLink } from "../types/Link";
import { ContentfulRichText } from "../types/RichText";
import { createContentfulNonRecursiveLink } from "../types/helpers/ContentfulLinkHelper";
import createContentfulRichText from "../types/helpers/ContentfulRichText";
import { SourceType } from "../../../components/types/FormSectionTypes";

const linkResolverMock = jest.fn();
jest.mock("../ContentfulLink", () => ({
  __esModule: true,
  default: (link: ContentfulLink) => linkResolverMock(link)
}));

const richTextResolverMock = jest.fn();
jest.mock("../ContentfulRichText", () => ({
  __esModule: true,
  default: (promo: ContentfulRichText) => richTextResolverMock(promo)
}));

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  linkResolverMock.mockResolvedValue("link");
  richTextResolverMock.mockResolvedValue("rich-text");
});

describe("ContentfulFormSection resolver", () => {
  it("should not call link resolver if successRedirect is null", async () => {
    const formSection = await resolveFormSection(
      createContentfulFormSectionData({ successRedirect: null })
    );
    expect(linkResolverMock).not.toHaveBeenCalled();
    expect(formSection.successRedirect).toBeNull();
  });

  it("should not call rich text resolver if successRedirect is null", async () => {
    const formSection = await resolveFormSection(
      createContentfulFormSectionData({ description: null })
    );
    expect(richTextResolverMock).not.toHaveBeenCalled();
    expect(formSection.description).toBeNull();
  });

  it("returns correct data if all the allowed fields provided", async () => {
    const data = createContentfulFormSectionData({
      __typename: "Form",
      showTitle: true,
      recipients: "recipients@email.com",
      inputs: [
        {
          name: "first-name",
          type: "text",
          label: "First name",
          width: "half",
          required: true
        },
        {
          name: "second-names",
          type: "text",
          label: "Second name",
          width: "half",
          required: true
        }
      ],
      submitText: "Submit text",
      successRedirect: createContentfulNonRecursiveLink(),
      description: createContentfulRichText(),
      source: SourceType.Contentful
    });
    const formSection = await resolveFormSection(data);

    expect(formSection).toEqual({
      __typename: "Form",
      showTitle: true,
      recipients: "recipients@email.com",
      inputs: [
        {
          name: "first-name",
          type: "text",
          label: "First name",
          width: "half",
          required: true
        },
        {
          name: "second-names",
          type: "text",
          label: "Second name",
          width: "half",
          required: true
        }
      ],
      submitText: "Submit text",
      successRedirect: "link",
      description: "rich-text",
      source: SourceType.Contentful
    });
    expect(linkResolverMock).toHaveBeenCalledWith(data.successRedirect);
    expect(richTextResolverMock).toHaveBeenCalledWith(data.description);
  });
});
