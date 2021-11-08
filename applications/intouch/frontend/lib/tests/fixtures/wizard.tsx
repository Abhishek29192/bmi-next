import React from "react";
import { generateProject } from "../factories/project";
import WizardContextWrapper, {
  ContextWrapperProps
} from "../../../components/WizardLayout/WizardContext";

const Wrapper = ({
  project = generateProject(),
  children
}: ContextWrapperProps) => {
  return (
    <WizardContextWrapper project={project}>{children}</WizardContextWrapper>
  );
};

export default Wrapper;
