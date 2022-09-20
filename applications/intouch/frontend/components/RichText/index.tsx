/* eslint-disable react/display-name */
import React from "react";
import {
  BLOCKS,
  MARKS,
  INLINES,
  Inline,
  Document
} from "@contentful/rich-text-types";
import Link from "next/link";
import { Typography } from "@bmi/components";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import styles from "./styles.module.scss";

export type RichTextProps = {
  content: Document;
  links?: Document;
};

function renderOptions(links) {
  // create an asset map
  const assetMap = new Map();
  // loop through the assets and add them to the map
  const blocks = links?.assets?.block;
  if (blocks != null) {
    for (const asset of blocks) {
      assetMap.set(asset.sys.id, asset);
    }
  }

  return {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node, children) => {
        if (
          Array.isArray(children) &&
          (!children.length || (children.length === 1 && !children[0]))
        ) {
          return null;
        }

        return <Typography gutterBottom>{children}</Typography>;
      },
      [BLOCKS.HEADING_2]: (_node, children) => (
        <Typography className={styles.title} variant="h2">
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_3]: (_node, children) => (
        <Typography className={styles.title} variant="h3">
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_4]: (_node, children) => (
        <Typography className={styles.title} variant="h4">
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_5]: (_node, children) => (
        <Typography className={styles.title} variant="h5">
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_6]: (_node, children) => (
        <Typography className={styles.title} variant="h6">
          {children}
        </Typography>
      ),
      [INLINES.HYPERLINK]: (node: Inline, children: React.ReactNode) => (
        <Link href={node.data.uri}>
          <a className={styles.link}>{children}</a>
        </Link>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        // find the asset in the assetMap by ID
        const asset = assetMap.get(node.data.target.sys.id);
        // render the asset accordingly
        return (
          <img
            className={styles.img}
            src={asset.url}
            alt={asset.title}
            width={asset.width}
            height={asset.height}
          />
        );
      }
    }
  };
}

export const RichText = ({ content, links }: RichTextProps) => {
  return (
    <div className={styles.main}>
      {documentToReactComponents(content, renderOptions(links))}
    </div>
  );
};
