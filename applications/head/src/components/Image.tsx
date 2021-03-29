import React from "react";
import { graphql } from "gatsby";
import Img, { GatsbyImageFluidProps } from "gatsby-image";

// TODO: This package gets deprecated in gatsby@3.x in favour of
// gatsby-plugin-image. When we migrate to next gatsby version we have to
// change this package too. For migration check https://www.gatsbyjs.com/docs/how-to/images-and-media/using-gatsby-plugin-image/#migrating

// TODO: Move in its own file.
type ContentfulAsset = GatsbyImageFluidProps & {
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
    x: number;
    y: number;
  } | null;
};

const Image = ({ data }: { data?: Data }) => {
  if (!data) {
    return null;
  }

  return <Img fluid={data.image.fluid} alt={data.altText} draggable={false} />;
};

export const renderImage = (data?: Data) => {
  if (!data) {
    return null;
  }

  return (
    <Img
      fluid={data.image.fluid}
      alt={data.altText}
      draggable={false}
      // NOTE: Remove default styling.
      style={{ position: undefined, overflow: undefined }}
    />
  );
};

export default Image;

export const query = graphql`
  fragment ImageFragment on ContentfulImage {
    type
    altText
    image {
      # srcSetBreakpoints
      # quality
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
    focalPoint {
      x
      y
    }
  }
`;
