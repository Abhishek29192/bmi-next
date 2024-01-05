import { graphql } from "gatsby";
import Img, { ImageLoaderProps } from "next/image";
import React from "react";
import { getPosition, typeToObjectFitMap } from "./utils";
import type { Props } from "./types";

const contentfulLoader = ({ src, width, quality }: ImageLoaderProps) => {
  if (src.includes("contentful")) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }
  return src;
};

const Image = ({
  altText,
  focalPoint,
  size,
  type,
  position,
  className,
  isMobile,
  loading = "lazy",
  ...props
}: Props) => {
  return (
    <Img
      loader={contentfulLoader}
      className={className}
      alt={altText}
      draggable={false}
      objectFit={size || typeToObjectFitMap[type || "Decorative"]}
      objectPosition={getPosition({
        size,
        position,
        focalPoint: focalPoint,
        isMobile: isMobile
      })}
      loading={loading}
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

  # Image "breakpoints" values were taken from the maximum of each theme breakpoint, except XL, which is set to be 2000px (who is realistically using our site larger than that?)
  # xs: 599px
  # sm: 719px
  # md: 839px
  # lg: 1439px
  # xl: 2000px

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

  # Although this is used, the resutling data is never used anywhere
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
