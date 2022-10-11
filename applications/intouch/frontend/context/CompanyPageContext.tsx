import React, { useState, createContext, useEffect } from "react";
import { GetOperationTypeCollectionQuery } from "../graphql/generated/operations";

export type ContextProps = {
  value: {
    operationTypes:
      | GetOperationTypeCollectionQuery["operationTypeCollection"]["items"]
      | [];
  };
};
type ContextWrapperProps = ContextProps & {
  children?: React.ReactNode;
};

export const CompanyPageContext = createContext<ContextProps["value"]>({
  operationTypes: []
});
export const useCompanyPageContext = () => React.useContext(CompanyPageContext);

const CompanyPageContextWrapper = ({
  value,
  children
}: ContextWrapperProps) => {
  const [operationTypes, setOperationTypes] = useState<
    ContextProps["value"]["operationTypes"]
  >(value.operationTypes || []);

  useEffect(() => {
    setOperationTypes(value.operationTypes);
  }, [value]);

  return (
    <CompanyPageContext.Provider value={{ operationTypes }}>
      {children}
    </CompanyPageContext.Provider>
  );
};

export default CompanyPageContextWrapper;
