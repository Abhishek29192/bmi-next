import { Inline } from "@contentful/rich-text-types";
import { graphql } from "gatsby";
import React from "react";
import EmbeddedLink from "./EmbeddedLink";

export type Settings = {
  theme?: "primary" | "secondary";
  backgroundTheme?: "light" | "dark";
};

const EmbeddedInline = ({
  node,
  ...settings
}: {
  node: Inline;
} & Settings) => {
  // NOTE: No type for this from Contentful, protecting in case it's missing in JSON
  const fields = node.data?.target;

  const Component = {
    ContentfulLink: EmbeddedLink
  }[fields.__typename];

  if (!Component) {
    return null;
  }

  return <Component fields={fields} {...settings} />;
};

export default EmbeddedInline;

export const query = graphql`
  fragment EmbeddedInlineFragment on ContentfulRichTextReference {
    ...EmbeddedLinkFragment
  }
  fragment EmbeddedInlineFragmentNonRecursive on ContentfulRichTextReference {
    ...EmbeddedLinkFragmentNonRecursive
  }
`;
