import React from "react";
import { Block } from "@contentful/rich-text-types";
import { graphql } from "gatsby";
import EmbeddedTable from "./EmbeddedTable";
import EmbeddedLink from "./EmbeddedLink";

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
  const fields = node.data?.target;

  const Component = {
    ContentfulTable: EmbeddedTable,
    ContentfulLink: EmbeddedLink
  }[fields.__typename];

  if (!Component) {
    return null;
  }

  return <Component fields={fields} {...settings} />;
};

export default EmbeddedBlock;

export const query = graphql`
  fragment EmbeddedBlockFragment on ContentfulRichTextReference {
    ...EmbeddedTableFragment
    ...EmbeddedLinkFragment
  }
  fragment EmbeddedBlockFragmentNonRecursive on ContentfulRichTextReference {
    ...EmbeddedTableFragment
    ...EmbeddedLinkFragmentNonRecursive
  }
`;
