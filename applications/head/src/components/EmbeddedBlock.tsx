import React from "react";
import EmbeddedTable from "./EmbeddedTable";
import { Block } from "@contentful/rich-text-types";

const EmbeddedBlock = ({ node }: { node: Block }) => {
  // NOTE: No type for this from Contentful, protecting in case it's missing in JSON
  const contentType = node.data?.target?.sys?.contentType?.sys?.contentful_id;
  const fields = node.data?.target?.fields;

  const Component = {
    table: EmbeddedTable
  }[contentType];

  if (!Component) {
    return null;
  }

  return <Component fields={fields} />;
};

export default EmbeddedBlock;
