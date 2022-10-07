import { GallerySectionImage, GallerySectionVideo } from "../media";

export const createGallerySectionImage = (): GallerySectionImage => ({
  __typename: "ContentfulImage",
  type: null,
  altText: "Lorem ipsum",
  caption: null,
  focalPoint: null,
  image: {
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
      fileName: "Lorem ipsum",
      url: "//images.asset.jpg"
    }
  }
});

export const createGallerySectionVideo = (): GallerySectionVideo => ({
  __typename: "ContentfulVideo",
  title: "Lorem ipsum video title",
  label: "Lorem ipsum video label",
  subtitle: "Lorem ipsum video subtitle",
  videoUrl: "https://www.youtube.com/watch?v=youtube-id",
  videoRatio: {
    width: 16,
    height: 9
  },
  previewMedia: {
    type: null,
    altText: "Lorem ipsum video image alt text",
    focalPoint: null,
    image: {
      thumbnail: {
        src: "//video-image.asset.jpg"
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
        fileName: "Lorem ipsum video image file name",
        url: "//video-images.asset.jpg"
      }
    }
  },
  defaultYouTubePreviewImage:
    "https://i.ytimg.com/vi/youtube-id/maxresdefault.jpg"
});
