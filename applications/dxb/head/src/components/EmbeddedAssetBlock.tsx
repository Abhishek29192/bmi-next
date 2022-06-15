import React from "react";
import { Block } from "@contentful/rich-text-types";
import { graphql } from "gatsby";

type FileData = {
  title: string;
  file: {
    url: string;
    contentType: keyof typeof contentTypeMap;
  };
};

// Note: embedded-asset-block not exclusively images
const contentTypeMap = {
  "image/jpg": "image",
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "image/svg+xml": "image"
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

  if (!file) {
    return null;
  }

  const { url, contentType } = file;

  // eslint-disable-next-line security/detect-object-injection
  if (contentTypeMap[contentType] === "image") {
    return (
      <img
        className={className}
        src={url.startsWith("https:") ? url : `https:${url}`}
        alt={title}
      />
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
