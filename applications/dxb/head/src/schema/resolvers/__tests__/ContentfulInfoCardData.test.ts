import resolveInfoCardData from "../ContentfulInfoCardData";
import createContentfulInfoPageData from "../types/helpers/ContentfulPageInfoDataHelper";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import createContentfulVideoData from "../types/helpers/ContetfulVideoHelper";
import createTag from "../../../__tests__/helpers/TagHelper";
import type { Page as PageData, Path } from "../utils/path";
import type { Data as ContentfulImageData } from "../../../components/image/contentful-image/types";
import type { Video as ContentfulVideo } from "../types/Video";

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

const resolvePathMock = jest.fn();
const getUrlFromPathMock = jest.fn();
jest.mock("../utils/path", () => ({
  resolvePath: (pageData: PageData) => resolvePathMock(pageData),
  getUrlFromPath: (path: Path) => getUrlFromPathMock(path)
}));

const pathMock: Path = [
  {
    id: "path-id",
    path: "path",
    label: "label",
    queryParams: "query params",
    slug: "slug"
  }
];

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  imageResolverMock.mockReturnValue("resolved-image");
  videoResolverMock.mockResolvedValue("resolved-video");
  resolvePathMock.mockResolvedValue(pathMock);
  getUrlFromPathMock.mockReturnValue("url-from-path");
});

describe("ContentfulInfoCardData resolver", () => {
  it("should not call image resolver if featuredMedia field is not provided", async () => {
    const resolvedInfoPageData = await resolveInfoCardData(
      createContentfulInfoPageData({ featuredMedia: null })
    );
    expect(imageResolverMock).not.toHaveBeenCalled();
    expect(resolvedInfoPageData.featuredMedia).toBeNull();
  });

  it("should not call video resolver if featuredVideo field is not provided", async () => {
    const resolvedInfoPageData = await resolveInfoCardData(
      createContentfulInfoPageData({ featuredVideo: null })
    );
    expect(videoResolverMock).not.toHaveBeenCalled();
    expect(resolvedInfoPageData.featuredVideo).toBeNull();
  });

  it("should return rawDate and date fields as null if date field is not provided", async () => {
    const resolvedInfoPageData = await resolveInfoCardData(
      createContentfulInfoPageData({ date: null })
    );
    expect(resolvedInfoPageData.date).toBeNull();
    expect(resolvedInfoPageData.rawDate).toBeNull();
  });

  it("should not return tags if tagsCollection field is null", async () => {
    const resolvedInfoPageData = await resolveInfoCardData(
      createContentfulInfoPageData({ tagsCollection: null })
    );
    expect(resolvedInfoPageData.tags).toBeNull();
  });

  it("returns correct data if all the allowed fields provided", async () => {
    const pageInfoData = createContentfulInfoPageData({
      __typename: "Page",
      title: "Title",
      subtitle: "Subtitle",
      brandLogo: "Zanda",
      slug: "slug",
      date: "Wed Jul 03 2024 16:35:28 GMT+0200",
      featuredMedia: createImageData(),
      featuredVideo: createContentfulVideoData(),
      parentPage: {
        __typename: "Page",
        sys: {
          id: "Parent page id"
        },
        title: "Parent page title",
        slug: "parent-page-slug",
        parentPage: null
      },
      sys: {
        id: "some-id"
      },
      tagsCollection: {
        items: [createTag()]
      }
    });
    expect(await resolveInfoCardData(pageInfoData)).toEqual({
      __typename: "Page",
      title: "Title",
      path: "url-from-path",
      subtitle: "Subtitle",
      brandLogo: "Zanda",
      slug: "slug",
      id: "some-id",
      date: "3. juli 2024",
      rawDate: "Wed Jul 03 2024 16:35:28 GMT+0200",
      featuredMedia: "resolved-image",
      featuredVideo: "resolved-video",
      tags: [createTag()]
    });
  });
});
