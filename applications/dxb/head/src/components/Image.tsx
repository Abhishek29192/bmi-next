import { graphql } from "gatsby";
import { IGatsbyImageData, GatsbyImage as Img } from "gatsby-plugin-image";
import React from "react";

type ImageData = {
  file: {
    fileName: string;
    url: string;
  };
  gatsbyImageData?: IGatsbyImageData;
  thumbnail?: IGatsbyImageData;
};

export type Data = {
  altText: string | null;
  type?: "Decorative" | "Descriptive" | null;
  image: ImageData;
  focalPoint?: {
    x: number;
    y: number;
  } | null;
};

type Options = {
  className?: string;
  size?: "cover" | "contain";
  position?: string;
  isMobile?: boolean;
};

const typeToObjectFitMap: Record<Data["type"], Options["size"]> = {
  Decorative: "cover",
  Descriptive: "contain"
};

const getPosition = ({
  size,
  position,
  focalPoint,
  isMobile
}: Options & Pick<Data, "focalPoint">): Options["position"] => {
  if (position) {
    return position;
  }

  if (isMobile) {
    return "center";
  }

  if (size === "cover" && focalPoint) {
    return `${focalPoint.x}% ${focalPoint.y}%`;
  }

  return "center";
};

const Image = ({
  altText,
  focalPoint,
  image,
  size,
  type,
  position,
  className,
  isMobile,
  ...props
}: Data & Options) => {
  if (!image?.gatsbyImageData) {
    return (
      <img
        className={className}
        src={image?.file.url}
        alt={altText}
        style={{
          objectFit: size || typeToObjectFitMap[type || "Decorative"],
          objectPosition: getPosition({
            size,
            position,
            focalPoint: focalPoint,
            isMobile: isMobile
          })
        }}
        {...props}
      />
    );
  }

  return (
    <Img
      image={image.gatsbyImageData}
      alt={altText}
      draggable={false}
      objectFit={size || typeToObjectFitMap[type || "Decorative"]}
      objectPosition={getPosition({
        size,
        position,
        focalPoint: focalPoint,
        isMobile: isMobile
      })}
      className={className}
      {...props}
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

  fragment VideoImageFragment on ContentfulImage {
    ...BaseImageFragment
    image {
      ...AssetFragment
      gatsbyImageData(
        placeholder: DOMINANT_COLOR
        width: 1070
        breakpoints: [561, 665, 785, 1070, 1070]
        formats: [WEBP, JPG, AUTO]
      )
    }
  }

  fragment ImageDocumentFragment on ContentfulImage {
    ...BaseImageFragment
    image {
      ...AssetFragment
      gatsbyImageData(
        placeholder: DOMINANT_COLOR
        width: 322
        breakpoints: [537, 641, 761, 493, 322]
        formats: [WEBP, JPG, AUTO]
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
        width: 1392
        breakpoints: [561, 665, 785, 1285, 1392]
        formats: [WEBP, JPG, AUTO]
      )
      thumbnail: gatsbyImageData(
        placeholder: DOMINANT_COLOR
        width: 80
        height: 60
        outputPixelDensities: [1]
        formats: [WEBP, JPG, AUTO]
      )
    }
  }

  fragment ImageCardFragment on ContentfulImage {
    ...BaseImageFragment
    image {
      ...AssetFragment
      gatsbyImageData(
        placeholder: DOMINANT_COLOR
        width: 330
        breakpoints: [561, 321, 381, 446, 330]
        formats: [WEBP, JPG, AUTO]
      )
    }
  }

  fragment ImageSlideFragment on ContentfulImage {
    ...BaseImageFragment
    image {
      ...AssetFragment
      gatsbyImageData(
        placeholder: DOMINANT_COLOR
        width: 920
        breakpoints: [561, 665, 381, 681, 920]
        formats: [WEBP, JPG, AUTO]
      )
    }
  }

  fragment ImageHeaderFragment on ContentfulImage {
    ...BaseImageFragment
    image {
      ...AssetFragment
      gatsbyImageData(
        placeholder: DOMINANT_COLOR
        width: 359
        breakpoints: [359, 359, 359, 326, 359]
        formats: [WEBP, JPG, AUTO]
      )
    }
  }

  fragment ImageVillainFragment on ContentfulImage {
    ...BaseImageFragment
    image {
      ...AssetFragment
      gatsbyImageData(
        layout: CONSTRAINED
        placeholder: DOMINANT_COLOR
        width: 920
        breakpoints: [561, 436, 516, 916, 920]
        formats: [WEBP, JPG, AUTO]
      )
    }
  }

  fragment ImageHeroFragment on ContentfulImage {
    ...BaseImageFragment
    image {
      ...AssetFragment
      gatsbyImageData(
        placeholder: DOMINANT_COLOR
        width: 988
        breakpoints: [593, 713, 408, 708, 988]
        formats: [WEBP, JPG, AUTO]
      )
    }
  }
`;
