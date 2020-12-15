import React, { useContext } from "react";
import { graphql, Link } from "gatsby";
import { Inline } from "@contentful/rich-text-types";
import AnchorLink from "@bmi/anchor-link";
import { getClickableActionFromUrl } from "./Link";
import { SiteContext } from "./Site";

const availableTypenames = [
  "ContentfulLink",
  "ContentfulSimplePage",
  "ContentfulContactUsPage",
  "ContentfulTeamPage",
  "ContentfulProductListerPage",
  "ContentfulDocumentLibraryPage"
];

type Props = {
  node: Inline;
  children: React.ReactNode;
};

const InlineHyperlink = ({ node, children }: Props) => {
  const { countryCode } = useContext(SiteContext);
  const fields = node.data.target;

  // TODO: Handle ContentfulLink case.
  if (!availableTypenames.includes(fields.__typename)) {
    return <>{children}</>;
  }

  if (fields.__typename === "ContentfulLink") {
    const { linkedPage, url, asset } = fields;
    return (
      <AnchorLink
        action={getClickableActionFromUrl(
          linkedPage,
          url,
          countryCode,
          asset ? `https:${asset?.file?.url}` : undefined
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
        to: `/${countryCode}/${fields.slug}`.replace(/\/+/gi, "/"),
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
    ... on ContentfulPage {
      __typename
      contentful_id
      slug
    }
  }
`;
