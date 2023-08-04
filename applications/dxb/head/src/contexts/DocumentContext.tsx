import React, { createContext, useState } from "react";

export interface selectAllStateType {
  isSelectedAll: boolean;
  docsCount: number;
  nonLinkedDocumentsCount: number;
}

type DocumentContextType = {
  selectedAllState: selectAllStateType;
  setSelectAllState: React.Dispatch<React.SetStateAction<selectAllStateType>>;
};

export const DocumentContext = createContext<DocumentContextType>(
  {} as DocumentContextType
);

export const DocumentListProvider = ({ children }) => {
  const [selectedAllState, setSelectAllState] = useState<selectAllStateType>({
    isSelectedAll: false,
    docsCount: 0,
    nonLinkedDocumentsCount: 0
  });

  return (
    <DocumentContext.Provider value={{ selectedAllState, setSelectAllState }}>
      {children}
    </DocumentContext.Provider>
  );
};
