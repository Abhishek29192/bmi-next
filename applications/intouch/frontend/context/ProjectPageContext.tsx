import React, { createContext } from "react";

export type ContextProps = { [key: string]: any };

type ContextWrapperProps = {
  value: ContextProps;
  children?: React.ReactNode;
};

export const ProjectPageContext = createContext<ContextProps | null>(null);
export const useProjectPageContext = () => React.useContext(ProjectPageContext);

const ProjectPageContextWrapper = ({
  value,
  children
}: ContextWrapperProps) => {
  return (
    <ProjectPageContext.Provider value={value}>
      {children}
    </ProjectPageContext.Provider>
  );
};

export default ProjectPageContextWrapper;
