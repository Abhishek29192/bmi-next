import React, { useContext } from "react";
import { graphql, Link } from "gatsby";
import { Inline } from "@contentful/rich-text-types";
import AnchorLink, { Props as AnchorLinkProps } from "@bmi/anchor-link";
import withGTM from "../utils/google-tag-manager";
import { getClickableActionFromUrl, getLinkURL } from "./Link";
import { SiteContext } from "./Site";
import { VisualiserContext } from "./Visualiser";
import { CalculatorContext } from "./PitchedRoofCalcualtor";

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

const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);

const InlineHyperlink = ({ node, children }: Props) => {
  const { countryCode } = useContext(SiteContext);
  const { open: openVisualiser } = useContext(VisualiserContext);
  const { open: openCalculator } = useContext(CalculatorContext);

  const fields = node.data.target;

  // TODO: Handle ContentfulLink case.
  if (!(fields && availableTypenames.includes(fields.__typename))) {
    return <>{children}</>;
  }

  if (fields.__typename === "ContentfulLink") {
    const { linkedPage, url, asset, type, parameters } = fields;
    return (
      <GTMAnchorLink
        action={getClickableActionFromUrl(
          linkedPage,
          getLinkURL(fields),
          countryCode,
          asset ? `https:${asset?.file?.url}` : undefined,
          String(children),
          type,
          () => {
            if (type === "Visualiser" && openVisualiser) {
              openVisualiser(parameters);
            } else if (type === "Calculator" && openCalculator) {
              openCalculator(parameters);
            }
          }
        )}
        gtm={{
          id: "cta-click1",
          label: children[0][1],
          action: url
        }}
      >
        {children}
      </GTMAnchorLink>
    );
  }

  if (fields.__typename === "ContentfulAsset") {
    const { file } = fields;
    return (
      <GTMAnchorLink
        action={getClickableActionFromUrl(
          undefined,
          undefined,
          countryCode,
          `https:${file.url}`,
          String(children)
        )}
        gtm={{
          id: "cta-click1",
          label: children[0][1],
          action: `https:${file.url}`
        }}
      >
        {children}
      </GTMAnchorLink>
    );
  }

  return (
    <GTMAnchorLink
      action={{
        model: "routerLink",
        to: `/${countryCode}/${fields.path}`.replace(/\/+/gi, "/"),
        linkComponent: Link
      }}
      gtm={{
        id: "cta-click1",
        label: children[0][1],
        action: `/${countryCode}/${fields.path}`.replace(/\/+/gi, "/")
      }}
    >
      {children}
    </GTMAnchorLink>
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
  fragment InlineHyperlinkFragmentNonRecursive on ContentfulRichTextReference {
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
      ...LinkFragmentNonRecursive
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
