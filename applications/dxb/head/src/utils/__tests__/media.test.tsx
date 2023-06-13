import React from "react";
import createGalleryPimVideo from "../../__tests__/helpers/GalleryPimVideoHelper";
import createGallerySectionImage from "../../__tests__/helpers/GallerySectionImageHelper";
import createGallerySectionVideo from "../../__tests__/helpers/GallerySectionVideo";
import createGatsbyImageData from "../../__tests__/helpers/GatsbyImageDataHelper";
import Image from "../../components/Image";
import Video from "../../components/Video";
import { GallerySectionMedias, getJpgImage, transformMediaSrc } from "../media";

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
    const image = createGallerySectionImage();
    const video = createGallerySectionVideo();
    const pimVideo = createGalleryPimVideo();
    const mockMedia: GallerySectionMedias[] = [image, video, pimVideo];

    const expectResult = transformMediaSrc(mockMedia);

    expect(expectResult[0]).toEqual({
      thumbnail: image.image.thumbnail?.images.fallback?.src,
      isVideo: false,
      caption: "CAPTION",
      altText: "alt text",
      media: <Image {...image} />
    });
    expect(expectResult[1]).toEqual({
      thumbnail: video.previewMedia.image.thumbnail.images.fallback.src,
      isVideo: true,
      caption: "ContentfulVideoSubtitle",
      altText: "label",
      media: <Video {...video} />
    });
    expect(expectResult[2]).toEqual({
      thumbnail: pimVideo.defaultYouTubePreviewImage,
      isVideo: true,
      caption: "PimVideoTitle",
      media: <Video {...pimVideo} />
    });
  });

  it("should return correct object if typeName === ContentfulVideo and previewMedia is null", () => {
    const video = createGallerySectionVideo({ previewMedia: undefined });
    const expectResult = transformMediaSrc([video]);

    expect(expectResult[0]).toEqual({
      thumbnail: "https://i.ytimg.com/vi/01SUXJmB9Ik/maxresdefault.jpg",
      isVideo: true,
      caption: "ContentfulVideoSubtitle",
      altText: "label",
      media: <Video {...video} />
    });
  });

  it("should return correct object if typeName === ContentfulVideo and subtitle is null", () => {
    const video = createGallerySectionVideo({ subtitle: null });
    const expectResult = transformMediaSrc([video]);

    expect(expectResult[0]).toEqual({
      thumbnail: video.previewMedia.image.thumbnail.images.fallback.src,
      isVideo: true,
      caption: undefined,
      altText: "label",
      media: <Video {...video} />
    });
  });

  it("should return correct object  if typeName === ContentfulImage and image.thumbnail.src is empty string", () => {
    const image = createGallerySectionImage({
      image: {
        file: {
          fileName: "Lorem ipsum",
          url: "//images.asset.jpg"
        },
        gatsbyImageData: createGatsbyImageData(),
        thumbnail: undefined
      }
    });
    const expectResult = transformMediaSrc([image]);

    expect(expectResult[0]).toEqual(
      expect.objectContaining({
        thumbnail: undefined,
        isVideo: false,
        caption: "CAPTION",
        altText: "alt text"
      })
    );
  });

  it("should return correct object  if typeName === ContentfulImage and image.thumbnail is null", () => {
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
          thumbnail: undefined
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
        thumbnail: undefined,
        isVideo: false,
        caption: "CAPTION",
        altText: "alt text"
      })
    );
  });

  it("should return correct object if typeName === ContentfulImage and item caption is null", () => {
    const image = createGallerySectionImage({
      caption: null
    });
    const expectResult = transformMediaSrc([image]);

    expect(expectResult[0]).toEqual(
      expect.objectContaining({
        thumbnail: image.image.thumbnail?.images.fallback?.src,
        isVideo: false,
        caption: undefined,
        altText: "alt text"
      })
    );
  });

  it("should return correct object if typeName === ContentfulImage and item altText is empty string", () => {
    const image = createGallerySectionImage({
      altText: ""
    });
    const expectResult = transformMediaSrc([image]);

    expect(expectResult[0]).toEqual(
      expect.objectContaining({
        thumbnail: image.image.thumbnail?.images.fallback?.src,
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
