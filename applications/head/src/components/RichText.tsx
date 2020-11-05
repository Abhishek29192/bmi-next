/* eslint-disable react/display-name */
import React from "react";
import { BLOCKS, MARKS, Document, Block } from "@contentful/rich-text-types";
import {
  documentToReactComponents,
  Options
} from "@contentful/rich-text-react-renderer";
import Typography from "@bmi/typography";
import EmbeddedBlock from "./EmbeddedBlock";

type Settings = {
  theme?: "primary" | "secondary";
  backgroundTheme?: "light" | "dark";
};

const getOptions = (settings: Settings): Options => ({
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => {
      if (!children) {
        return null;
      }

      if (
        Array.isArray(children) &&
        (!children.length || (children.length === 1 && !children[0]))
      ) {
        return null;
      }

      return <Typography gutterBottom>{children}</Typography>;
    },
    [BLOCKS.HEADING_2]: (_node, children) => (
      <Typography variant="h2">{children}</Typography>
    ),
    [BLOCKS.HEADING_3]: (_node, children) => (
      <Typography variant="h3">{children}</Typography>
    ),
    [BLOCKS.HEADING_4]: (_node, children) => (
      <Typography variant="h4">{children}</Typography>
    ),
    [BLOCKS.HEADING_5]: (_node, children) => (
      <Typography variant="h5">{children}</Typography>
    ),
    [BLOCKS.HEADING_6]: (_node, children) => (
      <Typography variant="h6">{children}</Typography>
    ),
    [BLOCKS.EMBEDDED_ENTRY]: (node: Block) => (
      <EmbeddedBlock node={node} {...settings} />
    )
  },
  renderMark: {
    [MARKS.BOLD]: (text) => <strong>{text}</strong>
  }
});

const RichText = ({
  document,
  ...rest
}: {
  document: Document;
} & Settings) => {
  return <div>{documentToReactComponents(document, getOptions(rest))}</div>;
};

export default RichText;
