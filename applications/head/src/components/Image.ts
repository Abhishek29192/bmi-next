import { graphql } from "gatsby";

// TODO: Move in its own file.
type ContentfulAsset = {
  resize: {
    src: string;
  };
  file?: {
    fileName: string;
    url: string;
  };
};

export type Data = {
  type: string | null;
  altText: string | null;
  image: ContentfulAsset;
  caption: {
    caption: string;
  } | null;
  focalPoint: {
    focalPoint: {
      x: number;
      y: number;
    };
  } | null;
};

export const query = graphql`
  fragment ImageFragment on ContentfulImage {
    type
    altText
    image {
      resize(width: 1000, toFormat: JPG, jpegProgressive: true, quality: 60) {
        src
      }
      file {
        fileName
        url
      }
    }
    focalPoint {
      focalPoint {
        x
        y
      }
    }
  }
`;
