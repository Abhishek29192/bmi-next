import Section from "@bmi-digital/components/section";
import { graphql } from "gatsby";
import React, { useEffect } from "react";

export type Data = {
  __typename: "ContentfulEmbeddedScriptSection";
  title: string | null;
  scriptSectionId: string;
  url: string;
};

const EmbeddedScriptSection = ({
  data: { title, scriptSectionId, url },
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
    <Section>
      {title && <Section.Title>{title}</Section.Title>}
      <div
        id={scriptSectionId}
        data-testid={testId ?? "embedded-script-section"}
      ></div>
    </Section>
  );
};

export default EmbeddedScriptSection;

export const query = graphql`
  fragment EmbeddedScriptSectionFragment on ContentfulEmbeddedScriptSection {
    __typename
    title
    scriptSectionId
    url
  }
`;
