import { YoutubeVideo, YoutubeVideoProps } from "@bmi/components";
import React from "react";
import { GallerySectionImage, GallerySectionVideo } from "../../../utils/media";

export const createImage = (
  image?: Partial<GallerySectionImage["image"]>
): GallerySectionImage["image"] => ({
  thumbnail: {
    src: "//image.asset.jpg"
  },
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
    fileName: "Lorem ipsum image file name",
    url: "//images.asset.jpg"
  },
  ...image
});

export const createPreviewMedia = (
  media?: Partial<GallerySectionVideo["previewMedia"]>
): GallerySectionVideo["previewMedia"] => ({
  __typename: "ContentfulImage",
  type: null,
  altText: "Lorem ipsum video image alt text",
  caption: null,
  focalPoint: null,
  image: createImage(),
  ...media
});

export const createContentfulImage = (
  image?: Partial<GallerySectionImage>
): GallerySectionImage => ({
  __typename: "ContentfulImage",
  type: null,
  altText: "Lorem ipsum image alt text",
  caption: null,
  focalPoint: null,
  image: createImage(),
  ...image
});

export const createContentfulVideo = (
  video?: Partial<GallerySectionVideo>
): GallerySectionVideo => ({
  __typename: "ContentfulVideo",
  title: "Lorem ipsum video title",
  label: "Lorem ipsum video label",
  subtitle: "Lorem ipsum video subtitle",
  videoUrl: "https://www.youtube.com/watch?v=youtube-id",
  videoRatio: {
    width: 16,
    height: 9
  },
  previewMedia: createPreviewMedia(),
  ...video
});

export const createMockedYoutubeVideo = (
  props?: Partial<YoutubeVideoProps>
) => {
  return (
    <YoutubeVideo
      label="Lorem ipsum video label"
      subtitle="Lorem ipsum video subtitle"
      videoUrl="https://www.youtube.com/watch?v=youtube-id"
      embedHeight={9}
      embedWidth={16}
      previewImageSource="url"
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onGTMEvent={() => {}}
      dataGTM={{
        id: "media-gallery1",
        label: "Lorem ipsum image alt text",
        action: "//image.asset.jpg"
      }}
      {...props}
    />
  );
};
