import NextImage from "next/image";
import createGalleryPimVideo from "../../__tests__/helpers/GalleryPimVideoHelper";
import createGallerySectionImage from "../../__tests__/helpers/GallerySectionImageHelper";
import createGallerySectionVideo from "../../__tests__/helpers/GallerySectionVideo";
import { GallerySectionMedias, getJpgImage, transformMediaSrc } from "../media";

describe("getJpgImage function", () => {
  it("does nothing if undefined", () => {
    expect(getJpgImage(undefined)).toBeUndefined();
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
      altText: "alt text",
      caption: "CAPTION",
      isVideo: false,
      media: {
        alt: "alt text",
        className: undefined,
        component: NextImage,
        "data-testid": undefined,
        draggable: false,
        image: {
          backgroundColor: "#484848",
          height: 720,
          images: {
            fallback: {
              sizes: "(min-width: 948px) 948px, 100vw",
              src: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png",
              srcSet:
                "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png 948w"
            },
            sources: [
              {
                sizes: "(min-width: 948px) 948px, 100vw",
                srcSet:
                  "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=webp 948w",
                type: "image/webp"
              }
            ]
          },
          layout: "constrained",
          width: 948
        },
        loading: "lazy",
        objectFit: "cover",
        objectPosition: "center"
      },
      thumbnail:
        "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png"
    });
    expect(expectResult[1]).toEqual({
      altText: "label",
      caption: "ContentfulVideoSubtitle",
      isVideo: true,
      media: {
        "data-testid": undefined,
        dataGTM: {
          action: "Play",
          id: "cta-click--video-youtube",
          label: "https://youtu.be/01SUXJmB9Ik-label"
        },
        embedHeight: 9,
        embedWidth: 16,
        label: "label",
        layout: "dialog",
        previewImageSource: {
          alt: "ContentfulVideoAltText",
          className: undefined,
          component: NextImage,
          "data-testid": undefined,
          draggable: false,
          image: {
            backgroundColor: "#484848",
            height: 720,
            images: {
              fallback: {
                sizes: "(min-width: 948px) 948px, 100vw",
                src: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png",
                srcSet:
                  "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png 948w"
              },
              sources: [
                {
                  sizes: "(min-width: 948px) 948px, 100vw",
                  srcSet:
                    "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=webp 948w",
                  type: "image/webp"
                }
              ]
            },
            layout: "constrained",
            width: 948
          },
          loading: "lazy",
          objectFit: "contain",
          objectPosition: "center"
        },
        subtitle: "ContentfulVideoSubtitle",
        videoUrl: "https://youtu.be/01SUXJmB9Ik"
      },
      thumbnail:
        "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png"
    });
    expect(expectResult[2]).toEqual({
      caption: "PimVideoTitle",
      isVideo: true,
      media: {
        "data-testid": undefined,
        dataGTM: {
          action: "Play",
          id: "cta-click--video-youtube",
          label: "https://www.youtube.com/watch?v=AGVIbPFLDcI-PimVideoLabel"
        },
        embedHeight: 0,
        embedWidth: 0,
        label: "PimVideoLabel",
        layout: "dialog",
        previewImageSource:
          "https://i.ytimg.com/vi/AGVIbPFLDcI/maxresdefault.jpg",
        subtitle: "subtitle",
        videoUrl: "https://www.youtube.com/watch?v=AGVIbPFLDcI"
      },
      thumbnail: "https://i.ytimg.com/vi/AGVIbPFLDcI/maxresdefault.jpg"
    });
  });

  it("should return correct object if typeName === ContentfulVideo and previewMedia is null", () => {
    const video = createGallerySectionVideo({ previewMedia: undefined });
    const expectResult = transformMediaSrc([video]);

    expect(expectResult[0]).toEqual({
      altText: "label",
      caption: "ContentfulVideoSubtitle",
      isVideo: true,
      media: {
        "data-testid": undefined,
        dataGTM: {
          action: "Play",
          id: "cta-click--video-youtube",
          label: "https://youtu.be/01SUXJmB9Ik-label"
        },
        embedHeight: 9,
        embedWidth: 16,
        label: "label",
        layout: "dialog",
        previewImageSource:
          "https://i.ytimg.com/vi/01SUXJmB9Ik/maxresdefault.jpg",
        subtitle: "ContentfulVideoSubtitle",
        videoUrl: "https://youtu.be/01SUXJmB9Ik"
      },
      thumbnail: "https://i.ytimg.com/vi/01SUXJmB9Ik/maxresdefault.jpg"
    });
  });

  it("should return correct object if typeName === ContentfulVideo and subtitle is null", () => {
    const video = createGallerySectionVideo({ subtitle: null });
    const expectResult = transformMediaSrc([video]);

    expect(expectResult[0]).toEqual({
      altText: "label",
      caption: undefined,
      isVideo: true,
      media: {
        "data-testid": undefined,
        dataGTM: {
          action: "Play",
          id: "cta-click--video-youtube",
          label: "https://youtu.be/01SUXJmB9Ik-label"
        },
        embedHeight: 9,
        embedWidth: 16,
        label: "label",
        layout: "dialog",
        previewImageSource: {
          alt: "ContentfulVideoAltText",
          className: undefined,
          component: NextImage,
          "data-testid": undefined,
          draggable: false,
          image: {
            backgroundColor: "#484848",
            height: 720,
            images: {
              fallback: {
                sizes: "(min-width: 948px) 948px, 100vw",
                src: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png",
                srcSet:
                  "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png 948w"
              },
              sources: [
                {
                  sizes: "(min-width: 948px) 948px, 100vw",
                  srcSet:
                    "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=webp 948w",
                  type: "image/webp"
                }
              ]
            },
            layout: "constrained",
            width: 948
          },
          loading: "lazy",
          objectFit: "contain",
          objectPosition: "center"
        },
        subtitle: null,
        videoUrl: "https://youtu.be/01SUXJmB9Ik"
      },
      thumbnail:
        "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png"
    });
  });

  it("should return correct object  if typeName === ContentfulImage and image.thumbnail.src is empty string", () => {
    const image = createGallerySectionImage({
      image: {
        file: {
          fileName: "Lorem ipsum"
        },
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
