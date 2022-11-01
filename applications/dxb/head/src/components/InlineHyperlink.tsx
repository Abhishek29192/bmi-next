import { AnchorLink, AnchorLinkProps } from "@bmi-digital/components";
import { Inline } from "@contentful/rich-text-types";
import { graphql, Link } from "gatsby";
import React, { useCallback, useContext, useState } from "react";
import withGTM from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import { getClickableActionFromUrl, getLinkURL, renderDialog } from "./Link";
import { CalculatorContext } from "./PitchedRoofCalcualtor";
import { useSiteContext } from "./Site";
import { VisualiserContext } from "./Visualiser";

const availableTypenames = [
  "ContentfulAsset",
  "ContentfulLink",
  "ContentfulHomePage",
  "ContentfulSimplePage",
  "ContentfulContactUsPage",
  "ContentfulProductListerPage",
  "ContentfulDocumentLibraryPage",
  "ContentfulBrandLandingPage"
];

type Props = {
  node: Inline;
  children: React.ReactNode;
  gtmLabel?: React.ReactNode;
};

const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);

const InlineHyperlink = ({ node, children, gtmLabel }: Props) => {
  const { countryCode } = useSiteContext();
  const { open: openVisualiser } = useContext(VisualiserContext);
  const { open: openCalculator } = useContext(CalculatorContext);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const fields = node.data.target;

  const handleDialogCloseClick = useCallback(() => {
    setDialogIsOpen(false);
  }, []);

  // TODO: Handle ContentfulLink case.
  if (!(fields && availableTypenames.includes(fields.__typename))) {
    return <>{children}</>;
  }

  const label = gtmLabel ? `${gtmLabel} - ${children[0][1]}` : children[0][1];

  if (fields.__typename === "ContentfulLink") {
    const { linkedPage, url, asset, type, parameters } = fields;

    return (
      <>
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
              } else if (type === "Dialog") {
                setDialogIsOpen(true);
              }
            }
          )}
          gtm={{
            id: "cta-click1",
            label,
            action: url
          }}
          {...(type === "Visualiser" ||
          type === "Calculator" ||
          type === "Dialog"
            ? { component: "button" }
            : {})}
        >
          {children}
        </GTMAnchorLink>
        {type === "Dialog" &&
          fields?.dialogContent &&
          renderDialog(fields, dialogIsOpen, handleDialogCloseClick)}
      </>
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
          label,
          action: `https:${file.url}`
        }}
      >
        {children}
      </GTMAnchorLink>
    );
  }
  const action = getPathWithCountryCode(countryCode, fields.path).replace(
    /\/+/gi,
    "/"
  );
  return (
    <GTMAnchorLink
      action={{
        model: "routerLink",
        to: action,
        linkComponent: Link
      }}
      gtm={{
        id: "cta-click1",
        label,
        action
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
