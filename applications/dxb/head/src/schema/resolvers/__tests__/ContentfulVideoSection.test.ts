import createContentfulVideoSection from "../types/helpers/ContentfulVideoSectionHelper";
import resolveVideoSection from "../ContentfulVideoSection";
import createContentfulRichText from "../types/helpers/ContentfulRichText";
import createContentfulVideo from "../types/helpers/ContetfulVideoHelper";
import type { Video as ContentfulVideo } from "../types/Video";
import type { ContentfulRichText } from "../types/RichText";

const resolveVideoMock = jest.fn();
jest.mock("../ContentfulVideo", () => ({
  __esModule: true,
  default: (video: ContentfulVideo) => resolveVideoMock(video)
}));

const resolveRichTextMock = jest.fn();
jest.mock("../ContentfulRichText", () => ({
  __esModule: true,
  default: (promo: ContentfulRichText) => resolveRichTextMock(promo)
}));

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  resolveVideoMock.mockResolvedValue("resolved-video");
  resolveRichTextMock.mockResolvedValue("resolved-rich-text");
});

describe("ContentfulVideoSection resolver", () => {
  it("should not call rich text resolver if description is not provided", async () => {
    const resolvedVideoSection = await resolveVideoSection(
      createContentfulVideoSection({ description: null })
    );
    expect(resolvedVideoSection.description).toBe(null);
    expect(resolveRichTextMock).not.toHaveBeenCalled();
  });

  it("should call rich text resolver if description is provided", async () => {
    const videoSection = createContentfulVideoSection({
      description: createContentfulRichText()
    });
    const resolvedVideoSection = await resolveVideoSection(videoSection);
    expect(resolvedVideoSection.description).toBe("resolved-rich-text");
    expect(resolveRichTextMock).toHaveBeenCalledWith(videoSection.description);
  });

  it("returns correct data if all the allowed fields provided", async () => {
    const videoSection = createContentfulVideoSection({
      __typename: "VideoSection",
      name: "Name",
      title: "Title",
      video: createContentfulVideo(),
      description: createContentfulRichText()
    });
    expect(await resolveVideoSection(videoSection)).toEqual({
      __typename: "VideoSection",
      name: "Name",
      title: "Title",
      video: "resolved-video",
      description: "resolved-rich-text"
    });
    expect(resolveVideoMock).toHaveBeenCalledWith(videoSection.video);
    expect(resolveRichTextMock).toHaveBeenCalledWith(videoSection.description);
  });
});
