import { graphql } from "gatsby";
// TODO: This package gets deprecated in gatsby@3.x in favour of
// gatsby-plugin-image. When we migrate to next gatsby version we have to
// change this package too. For migration check https://www.gatsbyjs.com/docs/how-to/images-and-media/using-gatsby-plugin-image/#migrating
import { GatsbyImageFluidProps } from "gatsby-image";

export type Data = GatsbyImageFluidProps & {
  resize: {
    src: string;
  };
  file?: {
    fileName: string;
    url: string;
  };
};

export const query = graphql`
  fragment AssetFragment on ContentfulAsset {
    fluid {
      ...GatsbyContentfulFluid
    }
    resize(width: 1000, toFormat: JPG, jpegProgressive: true, quality: 60) {
      src
    }
    file {
      fileName
      url
    }
  }
`;
