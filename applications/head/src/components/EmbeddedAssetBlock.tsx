import React from "react";
import { Block } from "@contentful/rich-text-types";
import { graphql } from "gatsby";

type FileData = {
  title: string;
  file: {
    url: string;
    // TODO: type for set of contentTypes
    // Tracked by https://bmigroup.atlassian.net/browse/DXB-1186
    contentType: string;
  };
};

// Note: embedded-asset-block not exclusively images
const contentTypeMap = {
  "image/jpg": "image",
  "image/jpeg": "image",
  "image/png": "image"
};

const EmbeddedAssetBlock = ({
  node,
  className
}: {
  node: Block;
  className: string;
}) => {
  const data: FileData = node.data?.target;
  const { title, file } = data;
  const { url, contentType } = file;

  if (contentTypeMap[contentType] === "image") {
    return <img className={className} src={`http:${url}`} alt={title} />;
  }

  return null;
};

export default EmbeddedAssetBlock;

export const query = graphql`
  fragment EmbeddedAssetBlockFragment on ContentfulAsset {
    contentful_id
    title
    file {
      url
      contentType
    }
  }
`;
