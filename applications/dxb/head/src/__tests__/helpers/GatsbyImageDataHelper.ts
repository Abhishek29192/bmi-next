import { IGatsbyImageData } from "gatsby-plugin-image";

const createGatsbyImageData = (
  gatsbyImageData?: Partial<IGatsbyImageData>
): IGatsbyImageData => ({
  images: {
    sources: [
      {
        srcSet:
          "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=webp 948w",
        sizes: "(min-width: 948px) 948px, 100vw",
        type: "image/webp"
      }
    ],
    fallback: {
      src: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png",
      srcSet:
        "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png 948w",
      sizes: "(min-width: 948px) 948px, 100vw"
    }
  },
  layout: "constrained",
  backgroundColor: "#484848",
  width: 948,
  height: 720,
  ...gatsbyImageData
});

export default createGatsbyImageData;
