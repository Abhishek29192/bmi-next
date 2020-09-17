/* eslint-disable react/display-name */
import React from "react";
import { BLOCKS, MARKS, Document } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Typography from "@bmi/typography";

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <Typography gutterBottom>{children}</Typography>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <Typography variant="h2">{children}</Typography>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <Typography variant="h3">{children}</Typography>
    ),
    [BLOCKS.HEADING_4]: (node, children) => (
      <Typography variant="h4">{children}</Typography>
    ),
    [BLOCKS.HEADING_5]: (node, children) => (
      <Typography variant="h5">{children}</Typography>
    ),
    [BLOCKS.HEADING_6]: (node, children) => (
      <Typography variant="h6">{children}</Typography>
    )
  },
  renderMark: {
    [MARKS.BOLD]: (text) => <strong>{text}</strong>
  }
};

const RichText = ({ document }: { document: Document }) => {
  return <div>{documentToReactComponents(document, options)}</div>;
};

export default RichText;
