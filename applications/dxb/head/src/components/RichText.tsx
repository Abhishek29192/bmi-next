/* eslint-disable react/display-name */
import { useIsClient } from "@bmi-digital/components";
import AnchorLink, {
  AnchorLinkProps
} from "@bmi-digital/components/anchor-link";
import Typography from "@bmi-digital/components/typography";
import { transformHyphens } from "@bmi-digital/components/utils";
import { Options } from "@contentful/rich-text-react-renderer";
import {
  Block,
  BLOCKS,
  Inline,
  INLINES,
  MARKS
} from "@contentful/rich-text-types";
import classnames from "classnames";
import { graphql } from "gatsby";
import { renderRichText } from "gatsby-source-contentful/rich-text";
import React from "react";
import { constructUrlWithPrevPage } from "../templates/myAccountPage/utils";
import withGTM from "../utils/google-tag-manager";
import EmbeddedAssetBlock from "./EmbeddedAssetBlock";
import EmbeddedBlock from "./EmbeddedBlock";
import EmbeddedInline from "./EmbeddedInline";
import InlineHyperlink from "./InlineHyperlink";
import { classes, StyledRichText } from "./styles/RichTextStyles";

export type RichTextData = Parameters<typeof renderRichText>[0];

type Settings = {
  theme?: "primary" | "secondary";
  backgroundTheme?: "light" | "dark";
  underlineHeadings?: ("h2" | "h3" | "h4" | "h5" | "h6")[];
  hyperlinkColor?: "default" | "black" | "white";
  gtmLabel?: React.ReactNode;
};

const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);

const getOptions = (settings: Settings, isClient: boolean): Options => {
  const { underlineHeadings = [], gtmLabel } = settings;
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
          className={classes.title}
          variant="h2"
          hasUnderline={underlineHeadings.includes("h2")}
        >
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_3]: (_node, children) => (
        <Typography
          className={classes.title}
          variant="h3"
          hasUnderline={underlineHeadings.includes("h3")}
        >
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_4]: (_node, children) => (
        <Typography
          className={classes.title}
          variant="h4"
          hasUnderline={underlineHeadings.includes("h4")}
        >
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_5]: (_node, children) => (
        <Typography
          className={classes.title}
          variant="h5"
          hasUnderline={underlineHeadings.includes("h5")}
        >
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_6]: (_node, children) => (
        <Typography
          className={classes.title}
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
        <EmbeddedAssetBlock node={node} className="embedded-asset" />
      ),
      [INLINES.ENTRY_HYPERLINK]: (node: Inline, children: React.ReactNode) => (
        <InlineHyperlink
          node={node}
          gtmLabel={gtmLabel}
          data-testid={"rich-text-entry-hyperlink"}
        >
          {children}
        </InlineHyperlink>
      ),
      [INLINES.ASSET_HYPERLINK]: (node: Inline, children: React.ReactNode) => (
        <InlineHyperlink node={node}>{children}</InlineHyperlink>
      ),
      [INLINES.HYPERLINK]: (node: Inline, children: React.ReactNode) => {
        const { uri } = node.data;
        const href =
          isClient && uri.includes(process.env.GATSBY_INTOUCH_ORIGIN)
            ? constructUrlWithPrevPage(uri)
            : uri;

        return (
          <GTMAnchorLink
            action={{
              model: "htmlLink",
              href,
              target: "_blank",
              rel: "noopener noreferrer"
            }}
            gtm={{
              id: "cta-click1",
              label: gtmLabel
                ? `${gtmLabel} - ${children[0][1]}`
                : children[0][1],
              action: href
            }}
            color={settings.hyperlinkColor}
            data-testid={"rich-text-hyperlink"}
          >
            {children}
          </GTMAnchorLink>
        );
      },
      [INLINES.EMBEDDED_ENTRY]: (node: Inline) => (
        <EmbeddedInline node={node} {...settings} />
      )
    },
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>
    },
    renderText: (text) => {
      return text.split("\n").reduce((children, textSegment, index) => {
        return [
          ...children,
          index > 0 && <br key={index} />,
          transformHyphens(textSegment)
        ];
      }, []);
    }
  };
};

const RichText = ({
  document,
  className,
  hasNoBottomMargin,
  ...rest
}: {
  document?: RichTextData | null;
  className?: string;
  hasNoBottomMargin?: boolean;
} & Settings) => {
  const { isClient } = useIsClient();
  if (!document) {
    return null;
  }

  return (
    <StyledRichText
      className={classnames(
        classes.root,
        hasNoBottomMargin && classes.noBottomMargin,
        className
      )}
    >
      {renderRichText(document, getOptions(rest, isClient))}
    </StyledRichText>
  );
};

export const parseReachDataRawFields = (
  document: RichTextData
): Record<string, string | undefined> => {
  const parsedRaw: {
    nodeType: string;
    data: Record<string, unknown>;
    content: Array<{
      nodeType: string;
      data: Record<string, unknown>;
      content: Array<{
        value: string;
        nodeType: string;
        data: Record<string, unknown>;
      }>;
    }>;
  } = JSON.parse(document.raw);

  let res: Record<string, string | undefined> = {};
  parsedRaw.content.forEach((item) => {
    res = { ...res, [item.nodeType]: item.content[0]?.value };
  });

  return res;
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
      ...EmbeddedInlineFragment
    }
  }
  fragment RichTextFragmentNonRecursive on ContentfulRichText {
    raw
    references {
      __typename
      ...InlineHyperlinkFragmentNonRecursive
      ...EmbeddedAssetBlockFragment
      ...EmbeddedBlockFragmentNonRecursive
      ...EmbeddedInlineFragmentNonRecursive
    }
  }
`;
