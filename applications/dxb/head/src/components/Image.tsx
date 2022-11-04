import { graphql } from "gatsby";
import { GatsbyImage as Img, IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";

type ImageData = {
  file: {
    fileName: string;
    url: string;
  };
  gatsbyImageData?: IGatsbyImageData;
};

export type Data = {
  altText: string | null;
  type?: "Decorative" | "Descriptive" | null;
  image: ImageData;
  focalPoint?: {
    x: number;
    y: number;
  } | null;
  thumbnail?: ImageData;
};

type Options = {
  className?: string;
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

const Image = ({ data, ...options }: { data?: Data } & Options) => {
  return renderImage(data, options);
};

export const renderImage = (data?: Data, options: Options = {}) => {
  if (!data) {
    return null;
  }

  const { size, position, className } = options;

  if (!data.image?.gatsbyImageData) {
    return (
      <img
        className={className}
        src={data.image?.file.url}
        alt={data.altText}
        style={{
          objectFit: size || typeToObjectFitMap[data.type || "Decorative"],
          objectPosition: getPosition({
            size,
            position,
            focalPoint: data.focalPoint
          })
        }}
      />
    );
  }

  return (
    <Img
      image={data.image.gatsbyImageData}
      alt={data.altText}
      draggable={false}
      style={{ position: undefined }}
      objectFit={size || typeToObjectFitMap[data.type || "Decorative"]}
      objectPosition={getPosition({
        size,
        position,
        focalPoint: data.focalPoint
      })}
      className={className}
    />
  );
};

export default Image;

export const query = graphql`
  fragment AssetFragment on ContentfulAsset {
    file {
      fileName
      url
    }
  }

  fragment BaseImageFragment on ContentfulImage {
    type
    altText
    type
    focalPoint {
      x
      y
    }
  }

  fragment ImageFragment on ContentfulImage {
    ...BaseImageFragment
    image {
      ...AssetFragment
      gatsbyImageData(
        placeholder: DOMINANT_COLOR
        width: 1000
        formats: [WEBP, AUTO]
      )
    }
  }

  fragment ImageDocumentFragment on ContentfulImage {
    ...BaseImageFragment
    image {
      ...AssetFragment
      gatsbyImageData(
        placeholder: DOMINANT_COLOR
        width: 342
        formats: [WEBP, AUTO]
      )
    }
  }

  fragment ImageGallerySlideFragment on ContentfulImage {
    ...BaseImageFragment
    __typename
    caption {
      caption
    }
    image {
      ...AssetFragment
      gatsbyImageData(
        placeholder: DOMINANT_COLOR
        width: 696
        formats: [WEBP, AUTO]
      )
      thumbnail: gatsbyImageData(
        placeholder: DOMINANT_COLOR
        width: 80
        height: 60
        formats: [WEBP, AUTO]
      )
    }
  }

  fragment ImageCardFragment on ContentfulImage {
    ...BaseImageFragment
    image {
      ...AssetFragment
      gatsbyImageData(
        placeholder: DOMINANT_COLOR
        width: 290
        formats: [WEBP, AUTO]
      )
    }
  }

  fragment ImageSlideFragment on ContentfulImage {
    ...BaseImageFragment
    image {
      ...AssetFragment
      gatsbyImageData(
        placeholder: DOMINANT_COLOR
        width: 460
        formats: [WEBP, AUTO]
      )
    }
  }
`;
