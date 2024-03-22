import { graphql } from "gatsby";
import React from "react";

export type Data = {
  __typename: "ContentfulEmbeddedScriptSection";
  scriptSectionId: string;
  url: string;
};

const EmbeddedScriptSection = ({
  data: { scriptSectionId, url },
  "data-testid": testId
}: {
  data: Data;
  "data-testid"?: string;
}) => {
  if (!scriptSectionId.trim() || !url.trim()) {
    return;
  }

  return (
    <div id={scriptSectionId} data-testid={testId ?? "embedded-script-section"}>
      <script async src={url} data-testid="embedded-script"></script>
    </div>
  );
};

export default EmbeddedScriptSection;

export const query = graphql`
  fragment EmbeddedScriptSectionFragment on ContentfulEmbeddedScriptSection {
    __typename
    url
    scriptSectionId
  }
`;
