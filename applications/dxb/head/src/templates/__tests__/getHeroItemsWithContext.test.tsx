const mockRenderImage = jest.fn();
jest.mock("../../components/Image", () => ({
  renderImage: mockRenderImage
}));
const mockRenderVideo = jest.fn();
jest.mock("../../components/Video", () => ({
  renderVideo: mockRenderVideo
}));

import { DataTypeEnum } from "../../components/Link";
import { Data as SlideData } from "../../components/Promo";
import { microCopy } from "../../constants/microCopies";
import { getHeroItemsWithContext } from "../helpers/getHeroItemsWithContext";

const context = {
  getMicroCopy: jest.fn()
};

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

describe("getHeroItemsWithContext", () => {
  const slide: SlideData = {
    __typename: "ContentfulPromo",
    id: "id",
    title: "homePageSlideTitle",
    subtitle: null,
    name: "name",
    body: null,
    brandLogo: null,
    tags: null,
    featuredMedia: null,
    cta: {
      __typename: "ContentfulLink",
      id: "98566b68-bad1-5d5a-ab42-ddad6f67120d",
      label: "slideCTA",
      icon: null,
      isLabelHidden: null,
      url: null,
      type: DataTypeEnum.Internal,
      linkedPage: {
        path: "roof-tiles/"
      },
      asset: null,
      parameters: null,
      dialogContent: null,
      hubSpotCTAID: null
    },
    featuredVideo: {
      __typename: "ContentfulVideo",
      title: "featuredVideo",
      label: "label",
      subtitle: null,
      videoUrl: "https://www.youtube.com/watch?v=youtubeId",
      previewMedia: null,
      videoRatio: null,
      defaultYouTubePreviewImage:
        "https://i.ytimg.com/vi/youtubeId/maxresdefault.jpg"
    },
    backgroundColor: null
  };

  it("should return data with video type", () => {
    const result = getHeroItemsWithContext(context, [slide]);

    expect(result.length).toBe(1);
    expect(result[0].title).toEqual(slide.title);
    expect(result[0].children).toEqual(slide.subtitle);
    expect(mockRenderVideo).toHaveBeenCalledTimes(1);
    expect(mockRenderVideo).toHaveBeenCalledWith(slide.featuredVideo);
    expect(result[0].cta).toBeTruthy();
  });

  it("should return data with image type", () => {
    slide.featuredVideo = null;
    slide.featuredMedia = {
      type: null,
      altText: "Lorem ipsum ContentfulImage",
      focalPoint: null,
      image: {
        gatsbyImageData: {
          images: {
            sources: [
              {
                srcSet:
                  "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=237&h=180&q=50&fm=webp 237w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=474&h=360&q=50&fm=webp 474w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=webp 948w",
                sizes: "(min-width: 948px) 948px, 100vw",
                type: "image/webp"
              }
            ],
            fallback: {
              src: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png",
              srcSet:
                "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=237&h=180&q=50&fm=png 237w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=474&h=360&q=50&fm=png 474w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png 948w",
              sizes: "(min-width: 948px) 948px, 100vw"
            }
          },
          layout: "constrained",
          backgroundColor: "#484848",
          width: 948,
          height: 720
        },
        file: {
          fileName: "Lorem ipsum",
          url: "//images.asset.jpg"
        }
      },
      thumbnail: {
        src: "//images.asset.jpg",
        file: {
          fileName: "Lorem ipsum",
          url: "//images.asset.jpg"
        }
      }
    };

    const result = getHeroItemsWithContext(context, [slide]);

    expect(result.length).toBe(1);
    expect(result[0].title).toEqual(slide.title);
    expect(result[0].children).toEqual(slide.subtitle);
    expect(mockRenderImage).toHaveBeenCalledTimes(1);
    expect(mockRenderImage).toHaveBeenCalledWith(slide.featuredMedia, {
      size: "cover"
    });
    expect(result[0].cta).toBeTruthy();
  });

  it("should return data without cta prop", () => {
    slide.cta = null;
    slide["path"] = null;

    const result = getHeroItemsWithContext(context, [slide]);

    expect(result[0].cta).toBeFalsy();
  });

  it("should call getMicroCopy function if slide __typename is not ContentfulPromo", () => {
    slide.__typename = null;
    slide.cta = {
      __typename: "ContentfulLink",
      id: "98566b68-bad1-5d5a-ab42-ddad6f67120d",
      label: "slideCTA",
      icon: null,
      isLabelHidden: null,
      url: null,
      type: DataTypeEnum.Internal,
      linkedPage: {
        path: "roof-tiles/"
      },
      asset: null,
      parameters: null,
      dialogContent: null,
      hubSpotCTAID: null
    };

    getHeroItemsWithContext(context, [slide]);

    expect(context.getMicroCopy).toHaveBeenCalledTimes(1);
    expect(context.getMicroCopy).toHaveBeenCalledWith(
      microCopy.PAGE_LINK_LABEL
    );
  });

  it("should call getMicroCopy function if slide doesn't have cta", () => {
    slide.cta = null;
    slide.__typename = "ContentfulPromo";

    getHeroItemsWithContext(context, [slide]);

    expect(context.getMicroCopy).toHaveBeenCalledTimes(1);
    expect(context.getMicroCopy).toHaveBeenCalledWith(
      microCopy.PAGE_LINK_LABEL
    );
  });
});
