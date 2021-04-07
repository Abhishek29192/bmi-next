import React from "react";
import { graphql } from "gatsby";
// NOTE: The `withIEPolyfill` package exports objectFit/Position.
import Img from "gatsby-image/withIEPolyfill";
import { Data as AssetData } from "./Asset";

export type Data = {
  altText: string | null;
  type: "Decorative" | "Descriptive" | null;
  image: AssetData;
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
    caption {
      caption
    }
    type
    image {
      ...AssetFragment
    }
    focalPoint {
      x
      y
    }
  }
`;
