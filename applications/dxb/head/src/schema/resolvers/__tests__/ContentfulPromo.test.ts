import resolvePromo from "../ContentfulPromo";
import createContentfulPromoData from "../types/helpers/ContentfulPromoHelper";
import createContentfulRichText from "../types/helpers/ContentfulRichText";
import createTagData from "../../../__tests__/helpers/TagHelper";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import createContentfulLink from "../types/helpers/ContentfulLinkHelper";
import createContentfulVideoData from "../types/helpers/ContetfulVideoHelper";
import type { Video as ContentfulVideo } from "../types/Video";
import type { Data as ContentfulImageData } from "../../../components/image/contentful-image/types";
import type { ContentfulLink } from "../types/Link";
import type { ContentfulRichText } from "../types/RichText";

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

const imageResolverMock = jest.fn();
jest.mock("../ContentfulImage", () => ({
  __esModule: true,
  default: (image: ContentfulImageData) => imageResolverMock(image)
}));

const videoResolverMock = jest.fn();
jest.mock("../ContentfulVideo", () => ({
  __esModule: true,
  default: (video: ContentfulVideo) => videoResolverMock(video)
}));

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  linkResolverMock.mockResolvedValue("resolved-link");
  richTextResolverMock.mockResolvedValue("resolved-rich-text");
  imageResolverMock.mockReturnValue("resolved-image");
  videoResolverMock.mockResolvedValue("resolved-video");
});

describe("ContentfulPromo resolver", () => {
  it("should return featuredMedia field as null and not call image resolver if not defined", async () => {
    const resolvedPromo = await resolvePromo(
      createContentfulPromoData({ featuredMedia: null })
    );
    expect(resolvedPromo.featuredMedia).toBeNull();
    expect(imageResolverMock).not.toHaveBeenCalled();
  });

  it("should return featuredVideo field as null and not call video resolver if not defined", async () => {
    const resolvedPromo = await resolvePromo(
      createContentfulPromoData({ featuredVideo: null })
    );
    expect(resolvedPromo.featuredVideo).toBeNull();
    expect(videoResolverMock).not.toHaveBeenCalled();
  });

  it("should return cta field as null and not call link resolver if not defined", async () => {
    const resolvedPromo = await resolvePromo(
      createContentfulPromoData({ cta: null })
    );
    expect(resolvedPromo.cta).toBeNull();
    expect(linkResolverMock).not.toHaveBeenCalled();
  });

  it("should return body field as null and not call rich text resolver if not defined", async () => {
    const resolvedPromo = await resolvePromo(
      createContentfulPromoData({ body: null })
    );
    expect(resolvedPromo.body).toBeNull();
    expect(richTextResolverMock).not.toHaveBeenCalled();
  });

  it("should return tags field as null aif tagsCollection field is not provided", async () => {
    const resolvedPromo = await resolvePromo(
      createContentfulPromoData({ tagsCollection: null })
    );
    expect(resolvedPromo.tags).toBeNull();
  });

  it("transforms promo correctly if all the allowed fields are provided", async () => {
    const promo = createContentfulPromoData({
      __typename: "Promo",
      id: "contentful-id",
      name: "Contentful Promo data",
      title: "Contentful Promo Title",
      subtitle: "Contentful Promo Subtitle",
      body: createContentfulRichText(),
      brandLogo: "AeroDek",
      tagsCollection: { items: [createTagData()] },
      featuredMedia: createImageData(),
      cta: createContentfulLink(),
      featuredVideo: createContentfulVideoData(),
      backgroundColor: "White"
    });

    expect(await resolvePromo(promo)).toEqual({
      __typename: "Promo",
      id: "contentful-id",
      name: "Contentful Promo data",
      title: "Contentful Promo Title",
      subtitle: "Contentful Promo Subtitle",
      body: "resolved-rich-text",
      brandLogo: "AeroDek",
      tags: [createTagData()],
      featuredMedia: "resolved-image",
      cta: "resolved-link",
      featuredVideo: "resolved-video",
      backgroundColor: "White"
    });
    expect(linkResolverMock).toHaveBeenCalledWith(promo.cta);
    expect(richTextResolverMock).toHaveBeenCalledWith(promo.body);
    expect(imageResolverMock).toHaveBeenCalledWith(promo.featuredMedia);
    expect(videoResolverMock).toHaveBeenCalledWith(promo.featuredVideo);
  });
});
