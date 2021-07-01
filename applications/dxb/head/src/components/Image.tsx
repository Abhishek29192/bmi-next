import React from "react";
import { graphql } from "gatsby";
import { GatsbyImage as Img, IGatsbyImageData } from "gatsby-plugin-image";

export type Data = {
  altText: string | null;
  type: "Decorative" | "Descriptive" | null;
  image: {
    file: {
      fileName: string;
      url: string;
    };
    gatsbyImageData: IGatsbyImageData;
  };
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
  return renderImage(data, { size, position });
};

export const renderImage = (data?: Data, options: Options = {}) => {
  if (!data) {
    return null;
  }

  const { size, position } = options;

  if (!data.image.gatsbyImageData) {
    return (
      <img
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
    caption {
      caption
    }
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
      gatsbyImageData(placeholder: BLURRED)
    }
  }
  fragment ImageGallerySlideFragment on ContentfulImage {
    ...BaseImageFragment
    image {
      ...AssetFragment
      gatsbyImageData(
        placeholder: BLURRED
        width: 1392
        formats: [WEBP, JPG, AUTO]
      )
    }
  }
  fragment ImageCardFragment on ContentfulImage {
    ...BaseImageFragment
    image {
      ...AssetFragment
      gatsbyImageData(
        placeholder: BLURRED
        width: 580
        formats: [WEBP, JPG, AUTO]
      )
    }
  }
  fragment ImageSlideFragment on ContentfulImage {
    ...BaseImageFragment
    image {
      ...AssetFragment
      gatsbyImageData(
        placeholder: BLURRED
        width: 684
        formats: [WEBP, JPG, AUTO]
      )
    }
  }
`;
