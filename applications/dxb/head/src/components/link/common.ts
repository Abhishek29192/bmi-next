import React from "react";
import FormSection from "../FormSection";
import TitleWithContentSection from "../TitleWithContentSection";

export const sectionsMap: { [sectionTypeName: string]: React.ElementType } = {
  Form: FormSection,
  TitleWithContent: TitleWithContentSection
};
