import { resolveBrands, resolveOverlapCards } from "../ContentfulHomePage";
import createContentfulHomePageBrand from "../types/helpers/ContentdulHomePageBrandHelper";
import creatContentfulParentPage from "../types/helpers/ContentfulParentPageHelper";
import createContentfulOverlapCard from "../types/helpers/ContentfulOverlapCardHelper";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import createContentfulVideoData from "../types/helpers/ContetfulVideoHelper";
import { Data as ContentfulImageData } from "../../../components/image/contentful-image/types";
import type { Path, Page as PageData } from "../utils/path";
import type { Video as ContentfulVideo } from "../types/Video";

const resolvePathMock = jest.fn();
const getUrlFromPathMock = jest.fn();
jest.mock("../utils/path", () => ({
  resolvePath: (pageData: PageData) => resolvePathMock(pageData),
  getUrlFromPath: (path: Path) => getUrlFromPathMock(path)
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

const pathMock: Path = [
  {
    id: "path-id",
    path: "path",
    label: "label",
    queryParams: "query params",
    slug: "slug"
  }
];

beforeEach(() => {
  resolvePathMock.mockResolvedValue(pathMock);
  getUrlFromPathMock.mockReturnValue("url-from-path");
  imageResolverMock.mockReturnValue("resolved-image");
  videoResolverMock.mockResolvedValue("resolved-video");
});

describe("ContentfulHomePage", () => {
  describe("resolveBrands", () => {
    it("returns correct data if all the allowed fields provided", async () => {
      const brand = createContentfulHomePageBrand({
        title: "Zanda",
        subtitle: "Zanda subtitle",
        brandLogo: "Zanda",
        sys: { id: "zanda-brand-id" },
        slug: "zanda-brand-slug",
        parentPage: creatContentfulParentPage()
      });
      const transformedBrands = await resolveBrands([brand]);

      expect(transformedBrands).toEqual([
        {
          brandLogo: "Zanda",
          path: "url-from-path",
          subtitle: "Zanda subtitle",
          title: "Zanda"
        }
      ]);
      expect(resolvePathMock).toHaveBeenCalledWith({
        title: brand.title,
        slug: brand.slug,
        sys: brand.sys,
        parentPage: brand.parentPage
      });
      expect(getUrlFromPathMock).toHaveBeenCalledWith(pathMock);
    });

    it("throws an error if path resolver fails", async () => {
      const error = new Error("Path resolver failed");
      resolvePathMock.mockRejectedValue(error);

      await expect(
        resolveBrands([createContentfulHomePageBrand()])
      ).rejects.toThrow(error);
    });
  });

  describe("resolveOverlapCards", () => {
    it("returns correct data if all the available fields provided", async () => {
      const card1 = createContentfulOverlapCard({
        __typename: "Page",
        slug: "simple-page-slug",
        title: "Title-1",
        featuredMedia: createImageData(),
        sys: {
          id: "card-1"
        },
        featuredVideo: createContentfulVideoData(),
        parentPage: creatContentfulParentPage()
      });
      const card2 = createContentfulOverlapCard({
        __typename: "ContactUsPage",
        slug: "contact-us-page-slug",
        title: "Title-2",
        featuredMedia: createImageData(),
        sys: {
          id: "card-2"
        },
        featuredVideo: createContentfulVideoData(),
        parentPage: creatContentfulParentPage()
      });

      expect(await resolveOverlapCards([card1, card2])).toEqual([
        {
          path: "url-from-path",
          title: "Title-1",
          featuredMedia: "resolved-image",
          featuredVideo: "resolved-video"
        },
        {
          path: "url-from-path",
          title: "Title-2",
          featuredMedia: "resolved-image",
          featuredVideo: "resolved-video"
        }
      ]);
      expect(videoResolverMock).toHaveBeenCalledTimes(2);
      expect(imageResolverMock).toHaveBeenCalledTimes(2);
      expect(resolvePathMock).toHaveBeenCalledTimes(2);
      expect(getUrlFromPathMock).toHaveBeenCalledTimes(2);
    });

    it("throws an error if video resolver fails", async () => {
      const error = new Error("Video resolver failed");
      videoResolverMock.mockRejectedValueOnce(error);

      await expect(
        resolveOverlapCards([
          createContentfulOverlapCard(),
          createContentfulOverlapCard()
        ])
      ).rejects.toThrow(error);
    });

    it("throws an error if path resolver fails", async () => {
      const error = new Error("Path resolver failed");
      resolvePathMock.mockRejectedValueOnce(error);

      await expect(
        resolveOverlapCards([
          createContentfulOverlapCard(),
          createContentfulOverlapCard()
        ])
      ).rejects.toThrow(error);
    });

    it("should not call video resolver if featuredVideo is null", async () => {
      const resolvedCards = await resolveOverlapCards([
        createContentfulOverlapCard({ featuredVideo: null }),
        createContentfulOverlapCard({ featuredVideo: null })
      ]);
      expect(videoResolverMock).not.toHaveBeenCalled();
      expect(resolvedCards[0].featuredVideo).toBeNull();
      expect(resolvedCards[1].featuredVideo).toBeNull();
    });

    it("should not call image resolver if featuredMedia is null", async () => {
      const resolvedCards = await resolveOverlapCards([
        createContentfulOverlapCard({ featuredMedia: null }),
        createContentfulOverlapCard({ featuredMedia: null })
      ]);
      expect(imageResolverMock).not.toHaveBeenCalled();
      expect(resolvedCards[0].featuredMedia).toBeNull();
      expect(resolvedCards[1].featuredMedia).toBeNull();
    });
  });
});
