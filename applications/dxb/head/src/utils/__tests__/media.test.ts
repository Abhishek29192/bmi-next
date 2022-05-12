import {
  filterAndTransformVideoData,
  getJpgImage,
  transformMediaSrc,
  GallerySectionMedias
} from "../media";
import createAsset from "../../__tests__/AssetHelper";

jest.mock("../../components/Video", () => ({
  ...(jest.requireActual("../../components/Video") as any),
  renderVideo: jest.fn()
}));

describe("getJpgImage function", () => {
  it("does nothing if undefined", () => {
    expect(getJpgImage(null)).toBeNull();
  });

  it("does nothing if not a contentful url", () => {
    const img = "notAContentgulURL.webp?h=250";

    expect(getJpgImage(img)).not.toContain(img + "fm=jpg");
  });

  it("does nothing if fm is already specified", () => {
    const img =
      "https://images.ctfassets.net/18fop5x17y3g/7JfBbAmDeTWlHzSlc1auWm/dead1b50a4dcf1ee9f6fba135f9135b3/BMI-Zanda-Logo-Web.webp?h=250&fm=webp";

    expect(getJpgImage(img)).not.toContain(img + "fm=jpg");
  });

  it("returns a jpeg image from contentful images api", () => {
    const img =
      "https://images.ctfassets.net/18fop5x17y3g/7JfBbAmDeTWlHzSlc1auWm/dead1b50a4dcf1ee9f6fba135f9135b3/BMI-Zanda-Logo-Web.webp?h=250";

    expect(getJpgImage(img)).toContain(img + "&fm=jpg");
  });

  it("returns a jpeg image from contentful images api when has no ?", () => {
    const img =
      "https://images.ctfassets.net/18fop5x17y3g/7JfBbAmDeTWlHzSlc1auWm/dead1b50a4dcf1ee9f6fba135f9135b3/BMI-Zanda-Logo-Web.webp";

    expect(getJpgImage(img)).toContain(img + "?fm=jpg");
  });
});

describe("transformMediaSrc function", () => {
  it("should return correct data", () => {
    const mockMedia: GallerySectionMedias[] = [
      {
        __typename: "ContentfulImage",
        altText: "alt text",
        type: null,
        image: {
          file: {
            fileName: "file",
            url: "//images.asset.jpg"
          },
          thumbnail: {
            src: "//images.asset.jpg"
          }
        },
        caption: {
          caption: "CAPTION"
        },
        focalPoint: null
      },
      {
        __typename: "ContentfulVideo",
        title: "featuredVideo",
        label: "label",
        subtitle: "ContentfulVideoSubtitle",
        videoUrl: "https://youtu.be/01SUXJmB9Ik",
        previewMedia: {
          altText: "ContentfulVideoAltText",
          __typename: "ContentfulImage",
          type: "Descriptive",
          image: {
            thumbnail: {
              src: "//images.asset.jpg"
            },
            file: {
              fileName: "fileName",
              url: "fileNameURL"
            }
          },
          caption: {
            caption: "Caption"
          },
          focalPoint: null
        },
        videoRatio: null
      },

      {
        __typename: "PimVideo",
        videoUrl: "https://www.youtube.com/watch?v=AGVIbPFLDcI%22",
        title: "PimVideoTitle",
        label: "PimVideoLabel",
        subtitle: "subtitle",
        previewMedia: null,
        videoRatio: null
      }
    ];
    const expectResult = transformMediaSrc(mockMedia);

    expect(expectResult[0]).toEqual(
      expect.objectContaining({
        thumbnail: "//images.asset.jpg",
        isVideo: false,
        caption: "CAPTION",
        altText: "alt text"
      })
    );
    expect(expectResult[1]).toEqual(
      expect.objectContaining({
        thumbnail: "//images.asset.jpg",
        isVideo: true,
        caption: "ContentfulVideoSubtitle",
        altText: "ContentfulVideoAltText"
      })
    );
    expect(expectResult[2]).toEqual(
      expect.objectContaining({
        thumbnail: "https://i.ytimg.com/vi/AGVIbPFLDcI%22/maxresdefault.jpg",
        isVideo: true,
        caption: "PimVideoTitle"
      })
    );
  });

  it("shuold return correct object if typeName === ContentfulVideo and previewMedia is null", () => {
    const mockMedia: GallerySectionMedias[] = [
      {
        __typename: "ContentfulVideo",
        title: "featuredVideo",
        label: "label",
        subtitle: "ContentfulVideoSubtitle",
        videoUrl: "https://youtu.be/01SUXJmB9Ik",
        previewMedia: null,
        videoRatio: null
      }
    ];
    const expectResult = transformMediaSrc(mockMedia);

    expect(expectResult[0]).toEqual(
      expect.objectContaining({
        thumbnail: "https://i.ytimg.com/vi/01SUXJmB9Ik/maxresdefault.jpg",
        isVideo: true,
        caption: "ContentfulVideoSubtitle",
        altText: undefined
      })
    );
  });

  it("shuold return correct object if typeName === ContentfulVideo and subtitle is null", () => {
    const mockMedia: GallerySectionMedias[] = [
      {
        __typename: "ContentfulVideo",
        title: "featuredVideo",
        label: "label",
        subtitle: null,
        videoUrl: "https://youtu.be/01SUXJmB9Ik",
        previewMedia: {
          altText: "ContentfulVideoAltText",
          __typename: "ContentfulImage",
          type: "Descriptive",
          image: {
            thumbnail: {
              src: "//images.asset.jpg"
            },
            file: {
              fileName: "fileName",
              url: "fileNameURL"
            }
          },
          caption: {
            caption: "Caption"
          },
          focalPoint: null
        },
        videoRatio: null
      }
    ];
    const expectResult = transformMediaSrc(mockMedia);

    expect(expectResult[0]).toEqual(
      expect.objectContaining({
        thumbnail: "//images.asset.jpg",
        isVideo: true,
        caption: undefined,
        altText: "ContentfulVideoAltText"
      })
    );
  });

  it("shuold return correct object  if typeName === ContentfulImage and image.thumbnail.src is empty string", () => {
    const mockMedia: GallerySectionMedias[] = [
      {
        __typename: "ContentfulImage",
        altText: "alt text",
        type: null,
        image: {
          file: {
            fileName: "file",
            url: "//images.asset.jpg"
          },
          thumbnail: {
            src: ""
          }
        },
        caption: {
          caption: "CAPTION"
        },
        focalPoint: null
      }
    ];
    const expectResult = transformMediaSrc(mockMedia);

    expect(expectResult[0]).toEqual(
      expect.objectContaining({
        thumbnail: null,
        isVideo: false,
        caption: "CAPTION",
        altText: "alt text"
      })
    );
  });

  it("shuold return correct object if typeName === ContentfulImage and item caption is null", () => {
    const mockMedia: GallerySectionMedias[] = [
      {
        __typename: "ContentfulImage",
        altText: "alt text",
        type: null,
        image: {
          file: {
            fileName: "file",
            url: "//images.asset.jpg"
          },
          thumbnail: {
            src: "//images.asset.jpg"
          }
        },
        caption: null,
        focalPoint: null
      }
    ];
    const expectResult = transformMediaSrc(mockMedia);

    expect(expectResult[0]).toEqual(
      expect.objectContaining({
        thumbnail: "//images.asset.jpg",
        isVideo: false,
        caption: undefined,
        altText: "alt text"
      })
    );
  });

  it("shuold return correct object if typeName === ContentfulImage and item altText is empty string", () => {
    const mockMedia: GallerySectionMedias[] = [
      {
        __typename: "ContentfulImage",
        altText: "",
        type: null,
        image: {
          file: {
            fileName: "file",
            url: "//images.asset.jpg"
          },
          thumbnail: {
            src: "//images.asset.jpg"
          }
        },
        caption: {
          caption: "CAPTION"
        },
        focalPoint: null
      }
    ];
    const expectResult = transformMediaSrc(mockMedia);

    expect(expectResult[0]).toEqual(
      expect.objectContaining({
        thumbnail: "//images.asset.jpg",
        isVideo: false,
        caption: "CAPTION",
        altText: undefined
      })
    );
  });

  it("should return empty array if data NOT passed", () => {
    const expectResult = transformMediaSrc();

    expect(expectResult).toEqual([]);
  });
});

describe("filterAndTransformVideoData", () => {
  it("should return only PIM videos transformed to VideoData", () => {
    const expectedVideo = createAsset({
      assetType: "VIDEO",
      mime: "application/octet-stream",
      name: "testVideo",
      url: "https://www.youtube.com/watch?v=PLLgrNGa4D4"
    });
    const mockMedia = [
      createAsset({ assetType: "CERTIFICATES" }),
      expectedVideo
    ];

    const expectResult = filterAndTransformVideoData(mockMedia);

    expect(expectResult).toStrictEqual([
      {
        __typename: "PimVideo",
        label: expectedVideo.name,
        title: "",
        previewMedia: null,
        subtitle: null,
        videoRatio: null,
        videoUrl: "https://www.youtube.com/watch?v=PLLgrNGa4D4"
      }
    ]);
  });

  it("should not error if PIM Video URL is null", () => {
    const expectedVideo = createAsset({
      assetType: "VIDEO",
      mime: "application/octet-stream",
      name: "testVideo",
      url: null
    });
    const mockMedia = [
      createAsset({ assetType: "CERTIFICATES" }),
      expectedVideo
    ];

    const expectResult = filterAndTransformVideoData(mockMedia);

    expect(expectResult).toStrictEqual([
      {
        __typename: "PimVideo",
        label: expectedVideo.name,
        title: "",
        previewMedia: null,
        subtitle: null,
        videoRatio: null,
        videoUrl: ""
      }
    ]);
  });
  it("should return an empty array if null is passed", () => {
    const expectResult = filterAndTransformVideoData(null);

    expect(expectResult).toStrictEqual([]);
  });
});
