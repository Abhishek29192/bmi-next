import React, { createContext, useState } from "react";
import Visualiser, {
  Parameters,
  tilesSetData,
  sidingsSetData
} from "@bmi/visualiser";
import { graphql } from "gatsby";

type Context = {
  isOpen: boolean;
  open?: (params?: object) => void;
};

export const VisualiserContext = createContext<Context>({
  isOpen: false
});

type Props = {
  children: React.ReactNode;
  contentSource: string;
};

const mapParameters = (params: any): Partial<Parameters> => {
  if (!params) {
    return {};
  }

  const { tileId, colourId, sidingId, viewMode } = params;

  return { tileId, colourId, sidingId, viewMode };
};

const VisualiserProvider = ({ children, contentSource }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [parameters, setParameters] = useState<Partial<Parameters>>({});

  const open: Context["open"] = (params) => {
    setParameters(mapParameters(params));
    setIsOpen(true);
  };

  return (
    <VisualiserContext.Provider value={{ isOpen, open }}>
      {children}

      <Visualiser
        open={isOpen}
        contentSource={contentSource}
        onClose={() => setIsOpen(false)}
        tiles={tilesSetData}
        sidings={sidingsSetData}
        {...parameters}
      />
    </VisualiserContext.Provider>
  );
};

export const query = graphql`
  fragment VisualiserFragment on contentfulLinkParametersJsonNode {
    tileId
    colourId
    sidingId
    viewMode
  }
`;

export default VisualiserProvider;
