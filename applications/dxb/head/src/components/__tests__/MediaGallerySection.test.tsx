import React from "react";
import { render } from "@testing-library/react";
import MediaGallerySection, { Data } from "../MediaGallerySection";
import { RichTextData } from "../RichText";

const raw = {
  nodeType: "document",
  data: {},
  content: [
    {
      nodeType: "heading-2",
      content: [{ nodeType: "text", value: "Heading 2", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: "paragraph",
      content: [
        {
          nodeType: "text",
          value: "this is a test paragraph",
          marks: [],
          data: {}
        }
      ],
      data: {}
    }
  ]
};

const document: RichTextData = {
  raw: JSON.stringify(raw),
  references: [
    {
      __typename: "NonType",
      contentful_id: "3tcysaa3PGMlm42U4WnlmK"
    }
  ]
};

describe("MediaGallerySection component", () => {
  it("renders correctly", () => {
    const data: Data = {
      __typename: "ContentfulMediaGallerySection",
      title: "Lorem ipsum",
      longDescription: null,
      medias: [
        {
          __typename: "ContentfulImage",
          type: null,
          altText: "Lorem ipsum image alt text",
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
              fileName: "Lorem ipsum image file name",
              url: "//images.asset.jpg"
            }
          }
        },
        {
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
            __typename: "ContentfulImage",
            type: null,
            altText: "Lorem ipsum video image alt text",
            caption: null,
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
          }
        }
      ]
    };

    const { container } = render(<MediaGallerySection data={data} />);

    expect(container).toMatchSnapshot();
  });

  it("renders correctly with long description", () => {
    const data: Data = {
      __typename: "ContentfulMediaGallerySection",
      title: "Lorem ipsum",
      longDescription: document,
      medias: [
        {
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
        }
      ]
    };

    const { container, getByText } = render(
      <MediaGallerySection data={data} />
    );

    expect(getByText("this is a test paragraph")).not.toBeNull();
    expect(container).toMatchSnapshot();
  });
});
