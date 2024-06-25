import React from "react";
import FormSection from "../FormSection";
import TitleWithContentSection from "../TitleWithContentSection";

export const sectionsMap: { [sectionTypeName: string]: React.ElementType } = {
  ContentfulFormSection: FormSection,
  ContentfulTitleWithContent: TitleWithContentSection
};
