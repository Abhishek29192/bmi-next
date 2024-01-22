import { Block } from "@contentful/rich-text-types";
import { useTheme } from "@mui/material/styles";
import { graphql } from "gatsby";
import React from "react";

type FileData = {
  title: string;
  file: {
    url: string;
    contentType: keyof typeof fallbackImageTypeMap;
  };
};

// Note: embedded-asset-block not exclusively images
const fallbackImageTypeMap = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "jpg",
  "image/gif": "gif",
  "image/svg+xml": "jpg"
};

const EmbeddedAssetBlock = ({
  node,
  className
}: {
  node: Block;
  className: string;
}) => {
  const data: FileData = node.data.target;
  const { title, file } = data;
  const theme = useTheme();

  if (!file) {
    return null;
  }

  const { url, contentType } = file;

  // eslint-disable-next-line security/detect-object-injection
  const fallbackImageType = fallbackImageTypeMap[contentType];
  if (fallbackImageType) {
    const formattedUrl = url.startsWith("https:") ? url : `https:${url}`;
    return (
      <picture>
        <source
          type="image/webp"
          srcSet={`${formattedUrl}?fm=webp&q=50&w=561 561w, ${formattedUrl}?fm=webp&q=50&w=665 665w, ${formattedUrl}?fm=webp&q=50&w=785 785w, ${formattedUrl}?fm=webp&q=50&w=916 916w, ${formattedUrl}?fm=webp&q=50&w=920 920w`}
          sizes={`(max-width: ${theme.breakpoints.values.sm}px) 561px, (max-width: ${theme.breakpoints.values.md}px) 665px, (max-width: ${theme.breakpoints.values.lg}px) 785px, (max-width: ${theme.breakpoints.values.xl}px) 916px, 920px`}
        />
        <source
          srcSet={`${formattedUrl}?q=50&w=561 561w, ${formattedUrl}?q=50&w=665 665w, ${formattedUrl}?q=50&w=785 785w, ${formattedUrl}?q=50&w=916 916w, ${formattedUrl}?q=50&w=920 920w`}
          sizes={`(max-width: ${theme.breakpoints.values.sm}px) 561px, (max-width: ${theme.breakpoints.values.md}px) 665px, (max-width: ${theme.breakpoints.values.lg}px) 785px, (max-width: ${theme.breakpoints.values.xl}px) 916px, 920px`}
        />
        <img
          className={className}
          draggable={false}
          decoding="async"
          loading="lazy"
          src={`${formattedUrl}?fm=${fallbackImageType}&q=50&fl=progressive&w=920`}
          srcSet={`${formattedUrl}?fm=${fallbackImageType}&q=50&w=561 561w, ${formattedUrl}?fm=${fallbackImageType}&q=50&w=665 665w, ${formattedUrl}?fm=${fallbackImageType}&q=50&w=785 785w, ${formattedUrl}?fm=${fallbackImageType}&q=50&w=916 916w, ${formattedUrl}?fm=${fallbackImageType}&q=50&w=920 920w`}
          alt={title}
        />
      </picture>
    );
  }

  return null;
};

export default EmbeddedAssetBlock;

export const query = graphql`
  # TODO: This doesn't match the schema
  fragment EmbeddedAssetBlockFragment on ContentfulAsset {
    contentful_id
    title
    file {
      url
      contentType
    }
  }
`;
