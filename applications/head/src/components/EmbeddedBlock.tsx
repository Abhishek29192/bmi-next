import React from "react";
import EmbeddedTable from "./EmbeddedTable";
import EmbeddedLink from "./EmbeddedLink";
import { Block } from "@contentful/rich-text-types";

export type Settings = {
  theme?: "primary" | "secondary";
  backgroundTheme?: "light" | "dark";
};

const EmbeddedBlock = ({
  node,
  ...settings
}: {
  node: Block;
} & Settings) => {
  // NOTE: No type for this from Contentful, protecting in case it's missing in JSON
  const contentType = node.data?.target?.sys?.contentType?.sys?.contentful_id;
  const fields = node.data?.target?.fields;

  const Component = {
    table: EmbeddedTable,
    link: EmbeddedLink
  }[contentType];

  if (!Component) {
    return null;
  }

  return <Component fields={fields} {...settings} />;
};

export default EmbeddedBlock;
