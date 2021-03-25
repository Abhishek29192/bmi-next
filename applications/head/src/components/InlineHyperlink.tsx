import React, { useContext } from "react";
import { graphql, Link } from "gatsby";
import { Inline } from "@contentful/rich-text-types";
import AnchorLink from "@bmi/anchor-link";
import { getClickableActionFromUrl } from "./Link";
import { SiteContext } from "./Site";
import { VisualiserContext } from "./Visualiser";

const availableTypenames = [
  "ContentfulAsset",
  "ContentfulLink",
  "ContentfulHomePage",
  "ContentfulSimplePage",
  "ContentfulContactUsPage",
  "ContentfulTeamPage",
  "ContentfulProductListerPage",
  "ContentfulDocumentLibraryPage",
  "ContentfulBrandLandingPage"
];

type Props = {
  node: Inline;
  children: React.ReactNode;
};

const InlineHyperlink = ({ node, children }: Props) => {
  const { countryCode } = useContext(SiteContext);
  const { open } = useContext(VisualiserContext);
  const fields = node.data.target;

  // TODO: Handle ContentfulLink case.
  if (!(fields && availableTypenames.includes(fields.__typename))) {
    return <>{children}</>;
  }

  if (fields.__typename === "ContentfulLink") {
    const { linkedPage, url, asset, type, parameters } = fields;
    return (
      <AnchorLink
        action={getClickableActionFromUrl(
          linkedPage,
          url,
          countryCode,
          asset ? `https:${asset?.file?.url}` : undefined,
          String(children),
          type,
          () => {
            open(parameters);
          }
        )}
      >
        {children}
      </AnchorLink>
    );
  }

  if (fields.__typename === "ContentfulAsset") {
    const { file } = fields;
    return (
      <AnchorLink
        action={getClickableActionFromUrl(
          undefined,
          undefined,
          countryCode,
          `https:${file.url}`,
          String(children)
        )}
      >
        {children}
      </AnchorLink>
    );
  }

  return (
    <AnchorLink
      action={{
        model: "routerLink",
        to: `/${countryCode}/${fields.path}`.replace(/\/+/gi, "/"),
        linkComponent: Link
      }}
    >
      {children}
    </AnchorLink>
  );
};

export default InlineHyperlink;

export const query = graphql`
  fragment InlineHyperlinkFragment on ContentfulRichTextReference {
    ... on ContentfulHomePage {
      __typename
      contentful_id
      path
    }
    ... on ContentfulPage {
      __typename
      contentful_id
      path
    }
    ... on ContentfulLink {
      __typename
      contentful_id
      ...LinkFragment
    }
    ... on ContentfulAsset {
      __typename
      contentful_id
      file {
        url
      }
    }
  }
`;
