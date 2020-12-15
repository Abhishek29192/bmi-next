/* eslint-disable react/display-name */
import React from "react";
import {
  BLOCKS,
  MARKS,
  INLINES,
  Block,
  Inline
} from "@contentful/rich-text-types";
import { Options } from "@contentful/rich-text-react-renderer";
import Typography from "@bmi/typography";
import AnchorLink from "@bmi/anchor-link";
import EmbeddedBlock from "./EmbeddedBlock";
import EmbeddedAssetBlock from "./EmbeddedAssetBlock";
import InlineHyperlink from "./InlineHyperlink";
import styles from "./styles/RichText.module.scss";
import { renderRichText } from "gatsby-source-contentful/rich-text";
import { graphql } from "gatsby";

export type RichTextData = Parameters<typeof renderRichText>[0];

type Settings = {
  theme?: "primary" | "secondary";
  backgroundTheme?: "light" | "dark";
  underlineHeadings?: ("h2" | "h3" | "h4" | "h5" | "h6")[];
};

const getOptions = (settings: Settings): Options => {
  const { underlineHeadings = [] } = settings;

  return {
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
        <Typography
          className={styles["title"]}
          variant="h2"
          hasUnderline={underlineHeadings.includes("h2")}
        >
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_3]: (_node, children) => (
        <Typography
          className={styles["title"]}
          variant="h3"
          hasUnderline={underlineHeadings.includes("h3")}
        >
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_4]: (_node, children) => (
        <Typography
          className={styles["title"]}
          variant="h4"
          hasUnderline={underlineHeadings.includes("h4")}
        >
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_5]: (_node, children) => (
        <Typography
          className={styles["title"]}
          variant="h5"
          hasUnderline={underlineHeadings.includes("h5")}
        >
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_6]: (_node, children) => (
        <Typography
          className={styles["title"]}
          variant="h6"
          hasUnderline={underlineHeadings.includes("h6")}
        >
          {children}
        </Typography>
      ),
      [BLOCKS.EMBEDDED_ENTRY]: (node: Block) => (
        <EmbeddedBlock node={node} {...settings} />
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: Block) => (
        <EmbeddedAssetBlock node={node} className={styles["embedded-asset"]} />
      ),
      [INLINES.ENTRY_HYPERLINK]: (node: Inline, children: React.ReactNode) => (
        <InlineHyperlink node={node}>{children}</InlineHyperlink>
      ),
      [INLINES.ASSET_HYPERLINK]: (node: Inline, children: React.ReactNode) => (
        <InlineHyperlink node={node}>{children}</InlineHyperlink>
      ),
      [INLINES.HYPERLINK]: (node: Inline, children: React.ReactNode) => (
        <AnchorLink
          action={{
            model: "htmlLink",
            href: node.data.uri,
            target: "_blank",
            rel: "noopener noreferrer"
          }}
        >
          {children}
        </AnchorLink>
      )
    },
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>
    }
  };
};

const RichText = ({
  document,
  ...rest
}: {
  document: RichTextData;
} & Settings) => {
  return (
    <div className={styles["RichText"]}>
      {renderRichText(document, getOptions(rest))}
    </div>
  );
};

export default RichText;

export const query = graphql`
  fragment RichTextFragment on ContentfulRichText {
    raw
    references {
      __typename
      ...InlineHyperlinkFragment
      ...EmbeddedAssetBlockFragment
      ...EmbeddedBlockFragment
    }
  }
`;
