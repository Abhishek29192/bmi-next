import type { Data as EmbeddedScriptSectionData } from "../../components/EmbeddedScriptSection";

const createEmbeddedScriptSection = (
  embeddedScriptSection?: Partial<EmbeddedScriptSectionData>
): EmbeddedScriptSectionData => ({
  __typename: "EmbeddedScriptSection",
  title: "Embedded Script",
  scriptSectionId: "test-id",
  url: "https://fake/script.mjs",
  ecmaScript: true,
  ...embeddedScriptSection
});

export default createEmbeddedScriptSection;
