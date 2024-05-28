import AnchorLink from "@bmi-digital/components/anchor-link";
import { Inline } from "@contentful/rich-text-types";
import { graphql } from "gatsby";
import NextLink from "next/link";
import React from "react";
import { getPathWithCountryCode } from "../utils/path";
import { useSiteContext } from "./Site";
import Link from "./link/Link";

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
  children: string;
  gtmLabel?: React.ReactNode;
  "data-testid"?: string;
};

const InlineHyperlink = ({
  node,
  children,
  gtmLabel,
  "data-testid": dataTestId
}: Props) => {
  const { countryCode } = useSiteContext();

  const fields = node.data.target;

  // TODO: Handle ContentfulLink case.
  if (!(fields && availableTypenames.includes(fields.__typename))) {
    return <>{children}</>;
  }

  const label = gtmLabel ? `${gtmLabel} - ${children[0][1]}` : children[0][1];

  if (fields.__typename === "ContentfulLink") {
    return (
      <Link data={fields} gtm={{ label }} data-testid={dataTestId}>
        {children}
      </Link>
    );
  }

  if (fields.__typename === "ContentfulAsset") {
    const { file } = fields;
    return (
      <AnchorLink
        href={`https:${file.url}`}
        gtm={{
          id: "cta-click1",
          label,
          action: `https:${file.url}`
        }}
        data-testid={dataTestId}
        external
      >
        {children}
      </AnchorLink>
    );
  }
  const action = getPathWithCountryCode(countryCode, fields.path).replace(
    /\/+/gi,
    "/"
  );
  return (
    <AnchorLink
      component={NextLink}
      href={action}
      gtm={{
        id: "cta-click1",
        label,
        action
      }}
      data-testid={dataTestId}
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
