import {
  filterAndTransformVideoData,
  getJpgImage,
  transformMediaSrc
} from "../media";
import createAsset from "../../__tests__/AssetHelper";

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
  it("test functionality", () => {
    const mockMedia = [
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
            fileName: "thumbnail",
            src: "//images.asset.jpg"
          }
        },
        caption: {
          caption: "CAPTION"
        }
      },
      {
        __typename: "ContentfulVideo",
        title: "featuredVideo",
        label: "label",
        subtitle: null,
        youtubeId: "youtubeId",
        previewMedia: null,
        videoRatio: null
      },
      {
        __typename: "PimVideo",
        allowedToDownload: true,
        assetType: "VIDEO",
        mime: "application/octet-stream",
        name: "testVideo",
        url: "https://www.youtube.com/watch?v=AGVIbPFLDcI%22",
        youtubeId: "AGVIbPFLDcI%22"
      }
    ];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const expectResult = transformMediaSrc(mockMedia);

    expect(expectResult[0]).toEqual(
      expect.objectContaining({
        thumbnail: "//images.asset.jpg",
        isVideo: false,
        caption: "CAPTION",
        altText: "alt text"
      })
    );
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
        youtubeId: "PLLgrNGa4D4"
      }
    ]);
  });
});
