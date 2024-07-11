/* eslint-disable react/display-name */
import { useIsClient } from "@bmi-digital/components/hooks";
import AnchorLink from "@bmi-digital/components/anchor-link";
import Typography from "@bmi-digital/components/typography";
import { transformHyphens } from "@bmi-digital/components/utils";
import {
  Options,
  documentToReactComponents
} from "@contentful/rich-text-react-renderer";
import {
  Block,
  BLOCKS,
  Inline,
  INLINES,
  MARKS
} from "@contentful/rich-text-types";
import classnames from "classnames";
import React from "react";
import { constructUrlWithPrevPage } from "../templates/myAccountPage/utils";
import EmbeddedAssetBlock from "./EmbeddedAssetBlock";
import EmbeddedBlock from "./EmbeddedBlock";
import EmbeddedInline from "./EmbeddedInline";
import InlineHyperlink from "./InlineHyperlink";
import { classes, StyledRichText } from "./styles/RichTextStyles";
import type { Data as LinkData } from "./link/types";
import type { TableFields as TableData } from "./EmbeddedTable";
import type { FileData as AssetData } from "./EmbeddedAssetBlock";
import type { Data as InlineHyperLinkData } from "./InlineHyperlink";

type ReferenceData = AssetData | LinkData | TableData | InlineHyperLinkData;

export type RichTextData = {
  json: Parameters<typeof documentToReactComponents>[0];
  references: Map<string, ReferenceData>;
};

type Settings = {
  theme?: "primary" | "secondary";
  backgroundTheme?: "light" | "dark";
  underlineHeadings?: ("h2" | "h3" | "h4" | "h5" | "h6")[];
  hyperlinkColor?: "default" | "black" | "white";
  gtmLabel?: React.ReactNode;
};

const getOptions = (
  settings: Settings,
  references: RichTextData["references"],
  isClient: boolean
): Options => {
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
        <EmbeddedBlock
          {...settings}
          fields={getReferenceData<LinkData | TableData>(
            references,
            node.data.target.sys.id
          )}
        />
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: Block) => (
        <EmbeddedAssetBlock
          data={getReferenceData<AssetData>(
            references,
            node.data.target.sys.id
          )}
          className="embedded-asset"
        />
      ),
      [INLINES.ENTRY_HYPERLINK]: (node: Inline, children: string) => (
        <InlineHyperlink
          data={getReferenceData<InlineHyperLinkData>(
            references,
            node.data.target.sys.id
          )}
          gtmLabel={gtmLabel}
          data-testid={"rich-text-entry-hyperlink"}
        >
          {children}
        </InlineHyperlink>
      ),
      [INLINES.ASSET_HYPERLINK]: (node: Inline, children: string) => (
        <InlineHyperlink
          data={getReferenceData<AssetData>(
            references,
            node.data.target.sys.id
          )}
        >
          {children}
        </InlineHyperlink>
      ),
      [INLINES.HYPERLINK]: (node: Inline, children: string) => {
        const { uri } = node.data;
        const href =
          isClient && uri.includes(process.env.NEXT_PUBLIC_INTOUCH_ORIGIN)
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
        <EmbeddedInline
          data={getReferenceData<LinkData>(references, node.data.target.sys.id)}
          {...settings}
        />
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
      {documentToReactComponents(
        document.json,
        getOptions(rest, document.references, isClient)
      )}
    </StyledRichText>
  );
};

export const parseRichDataRawFields = (
  document: RichTextData
): Record<string, string | undefined> => {
  const parsedRaw = document?.json;

  let res: Record<string, string | undefined> = {};
  parsedRaw.content.forEach((item) => {
    res = {
      ...res,
      [item.nodeType]:
        item.content[0] && "value" in item.content[0]
          ? item.content[0].value
          : undefined
    };
  });

  return res;
};

const getReferenceData = <T extends ReferenceData>(
  referencesMap: RichTextData["references"],
  key: string
) => referencesMap.get(key) as T;

export default RichText;
