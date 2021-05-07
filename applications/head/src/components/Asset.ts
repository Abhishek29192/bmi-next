import { graphql } from "gatsby";

export type Data = {
  resize: {
    src: string;
  };
  file: {
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
