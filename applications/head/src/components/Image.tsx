import React from "react";
import { graphql } from "gatsby";
// NOTE: The `withIEPolyfill` package exports objectFit/Position.
import Img from "gatsby-image/withIEPolyfill";
// TODO: This package gets deprecated in gatsby@3.x in favour of
// gatsby-plugin-image. When we migrate to next gatsby version we have to
// change this package too. For migration check https://www.gatsbyjs.com/docs/how-to/images-and-media/using-gatsby-plugin-image/#migrating
import { GatsbyImageFluidProps } from "gatsby-image";

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
  altText: string | null;
  type: "Decorative" | "Descriptive" | null;
  image: ContentfulAsset;
  caption: {
    caption: string;
  } | null;
  focalPoint: {
    x: number;
    y: number;
  } | null;
};

type Options = {
  size?: "cover" | "contain";
  position?: string;
};

const typeToObjectFitMap: Record<Data["type"], Options["size"]> = {
  Decorative: "cover",
  Descriptive: "contain"
};

const getPosition = ({
  size,
  position,
  focalPoint
}: Options & Pick<Data, "focalPoint">): Options["position"] => {
  if (position) {
    return position;
  }

  if (size === "cover" && focalPoint) {
    return `${focalPoint.x}% ${focalPoint.y}%`;
  }

  return "center";
};

const Image = ({ data, size, position }: { data?: Data } & Options) => {
  if (!data) {
    return null;
  }

  return (
    <Img
      fluid={data.image.fluid}
      alt={data.altText}
      draggable={false}
      style={{ position: undefined }}
      objectFit={size || typeToObjectFitMap[data.type || "Decorative"]}
      objectPosition={getPosition({
        size,
        position,
        focalPoint: data.focalPoint
      })}
    />
  );
};

export const renderImage = (data?: Data, options: Options = {}) => {
  if (!data) {
    return null;
  }

  const { size, position } = options;

  return (
    <Img
      fluid={data.image.fluid}
      alt={data.altText}
      draggable={false}
      style={{ position: undefined }}
      objectFit={size || typeToObjectFitMap[data.type || "Decorative"]}
      objectPosition={getPosition({
        size,
        position,
        focalPoint: data.focalPoint
      })}
    />
  );
};

export default Image;

export const query = graphql`
  fragment ImageFragment on ContentfulImage {
    type
    altText
    type
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
