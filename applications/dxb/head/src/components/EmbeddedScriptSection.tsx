import { graphql } from "gatsby";
import React, { useEffect } from "react";

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
  useEffect(() => {
    if (!scriptSectionId.trim() || !url.trim()) {
      return;
    }

    const script = document.createElement("script");

    script.src = url;
    script.type = "text/javascript";
    script.async = true;
    script.setAttribute("data-testid", "embedded-script");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [scriptSectionId, url]);

  if (!scriptSectionId.trim() || !url.trim()) {
    return;
  }

  return (
    <div
      id={scriptSectionId}
      data-testid={testId ?? "embedded-script-section"}
    ></div>
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
