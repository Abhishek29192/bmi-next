import { graphql } from "gatsby";
import React from "react";

export type Data = {
  __typename: "ContentfulEmbeddedScriptSection";
  id: string;
  url: string;
};

const EmbeddedScriptSection = ({
  data: { id, url },
  "data-testid": testId
}: {
  data: Data;
  "data-testid"?: string;
}) => {
  if (!id.trim() || !url.trim()) {
    return;
  }

  return (
    <div id={id} data-testid={testId ?? "embedded-script-section"}>
      <script src={url} data-testid="embedded-script"></script>
    </div>
  );
};

export default EmbeddedScriptSection;

export const query = graphql`
  fragment EmbeddedScriptSectionFragment on ContentfulEmbeddedScriptSection {
    __typename
    url
    id
  }
`;
