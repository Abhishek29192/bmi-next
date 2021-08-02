import React from "react";
import { render } from "@testing-library/react";
import ImageGallerySection, { Data } from "../ImageGallerySection";

describe("ImageGallerySection component", () => {
  it("renders correctly", () => {
    const data: Data = {
      __typename: "ContentfulImageGallerySection",
      title: "Lorem ipsum",
      description: null,
      medias: [
        {
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

    const { container } = render(<ImageGallerySection data={data} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
