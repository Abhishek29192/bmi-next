import React, { useContext } from "react";
import { Block } from "@contentful/rich-text-types";
import {
  getDataFromLocale,
  LocalisedFields
} from "../utils/get-data-from-locale";
import { SiteContext } from "./Site";

type FileData = {
  file: {
    url: string;
    title: string;
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
  const { node_locale } = useContext(SiteContext);
  const fields: LocalisedFields<FileData> = node.data?.target?.fields;

  const localFields = getDataFromLocale(node_locale, fields);

  const { url, title, contentType } = localFields.file;

  if (contentTypeMap[contentType] === "image") {
    return <img className={className} src={`http:${url}`} alt={title} />;
  }

  return null;
};

export default EmbeddedAssetBlock;
