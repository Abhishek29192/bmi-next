import Section from "@bmi-digital/components/section";
import { graphql } from "gatsby";
import React, { useEffect } from "react";

export type Data = {
  __typename: "ContentfulEmbeddedScriptSection";
  title: string | null;
  scriptSectionId: string;
  url: string;
  ecmaScript: boolean;
};

type Props = {
  data: Data;
  "data-testid"?: string;
};

const EmbeddedScriptSection = ({
  data: { title, scriptSectionId, url, ecmaScript },
  "data-testid": testId
}: Props) => {
  useEffect(() => {
    if (!scriptSectionId.trim() || !url.trim()) {
      return;
    }

    const script = document.createElement("script");

    script.src = url;
    script.async = true;
    script.setAttribute("data-testid", "embedded-script");
    if (ecmaScript) {
      script.type = "module";
    }
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [ecmaScript, scriptSectionId, url]);

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
    ecmaScript
  }
`;