/* eslint-disable react/display-name */
import { useIsClient } from "@bmi-digital/components/hooks";
import AnchorLink from "@bmi-digital/components/anchor-link";
import Typography from "@bmi-digital/components/typography";
import { transformHyphens } from "@bmi-digital/components/utils";
import {
  documentToReactComponents,
  Options
} from "@contentful/rich-text-react-renderer";
import {
  Block,
  BLOCKS,
  Inline,
  INLINES,
  MARKS
} from "@contentful/rich-text-types";
import classnames from "classnames";
import { graphql } from "gatsby";
import React from "react";
import { constructUrlWithPrevPage } from "../templates/myAccountPage/utils";
import EmbeddedAssetBlock from "./EmbeddedAssetBlock";
import EmbeddedBlock from "./EmbeddedBlock";
import EmbeddedInline from "./EmbeddedInline";
import InlineHyperlink from "./InlineHyperlink";
import { classes, StyledRichText } from "./styles/RichTextStyles";

export type RichTextData = Parameters<typeof documentToReactComponents>[0];

type Settings = {
  theme?: "primary" | "secondary";
  backgroundTheme?: "light" | "dark";
  underlineHeadings?: ("h2" | "h3" | "h4" | "h5" | "h6")[];
  hyperlinkColor?: "default" | "black" | "white";
  gtmLabel?: React.ReactNode;
};

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
      [INLINES.ENTRY_HYPERLINK]: (node: Inline, children: string) => (
        <InlineHyperlink
          node={node}
          gtmLabel={gtmLabel}
          data-testid={"rich-text-entry-hyperlink"}
        >
          {children}
        </InlineHyperlink>
      ),
      [INLINES.ASSET_HYPERLINK]: (node: Inline, children: string) => (
        <InlineHyperlink node={node}>{children}</InlineHyperlink>
      ),
      [INLINES.HYPERLINK]: (node: Inline, children: string) => {
        const { uri } = node.data;
        const href =
          isClient && uri.includes(process.env.GATSBY_INTOUCH_ORIGIN)
            ? constructUrlWithPrevPage(uri)
            : uri;

        return (
          <AnchorLink
            href={href}
            external
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
          </AnchorLink>
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
      {documentToReactComponents(document, getOptions(rest, isClient))}
    </StyledRichText>
  );
};

export const parseRichDataRawFields = (
  document: RichTextData
): Record<string, string | undefined> => {
  return document.content.reduce((acc, item) => {
    if (item.content[0].nodeType === "text") {
      return { ...acc, [item.nodeType]: item.content[0]?.value };
    }
    return acc;
  }, {});
};

export default RichText;

export const query = graphql`
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
