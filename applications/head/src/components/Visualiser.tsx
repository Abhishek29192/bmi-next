import React, { createContext, useContext, useState } from "react";
import queryString from "query-string";
import Visualiser, {
  Parameters,
  tilesSetData,
  sidingsSetData
} from "@bmi/visualiser";
import { Link, graphql } from "gatsby";
import { navigate, useLocation } from "@reach/router";
import { devLog } from "../utils/devLog";
import { getProductUrl } from "../utils/product-details-transforms";
import { SiteContext } from "./Site";

type Context = {
  isOpen: boolean;
  open?: (params?: object) => void;
};
export const VisualiserContext = createContext<Context>({
  isOpen: false,
  open: () => {
    if (!process.env.GATSBY_VISUALISER_ASSETS_URL) {
      devLog(
        "Visualiser: Make sure you define GATSBY_VISUALISER_ASSETS_URL in the .env file."
      );

      return;
    }

    devLog("Visualiser: Something went wrong");
  }
});

type Props = {
  children: React.ReactNode;
  contentSource?: string;
  variantCodeToPathMap: Record<string, string>;
};

const mapParameters = (params: any): Partial<Parameters> => {
  if (!params) {
    return {};
  }

  const { tileId, colourId, sidingId, viewMode } = params;

  return { tileId, colourId, sidingId, viewMode };
};

const VisualiserProvider = ({
  children,
  contentSource,
  variantCodeToPathMap = {}
}: Props) => {
  const location = useLocation();
  const parsedQueryParameters = mapParameters(
    queryString.parse(location.search, { parseNumbers: true })
  );

  const [isOpen, setIsOpen] = useState(
    Object.values(parsedQueryParameters).some(Boolean)
  );
  const [parameters, setParameters] = useState<Partial<Parameters>>({});
  const { countryCode } = useContext(SiteContext);

  if (!contentSource) {
    return (
      <VisualiserContext.Provider value={{ isOpen }}>
        {children}
      </VisualiserContext.Provider>
    );
  }

  const open: Context["open"] = (params) => {
    setParameters(mapParameters(params));
    setIsOpen(true);
  };

  const getProductLinkAction = (variantCode: string) => ({
    model: "routerLink",
    linkComponent: Link,
    to: getProductUrl(countryCode, variantCodeToPathMap[variantCode])
  });

  const handleOnChange = ({
    isOpen,
    ...params
  }: Partial<Parameters & { isOpen: boolean }>) => {
    navigate(
      isOpen ? calculatePathFromData(params) : calculatePathFromData({})
    );
  };

  const calculatePathFromData = (params: Partial<Parameters>) => {
    const { tileId, colourId, sidingId, viewMode, ...rest } = queryString.parse(
      location.search
    );

    const query = queryString.stringify(
      { ...rest, ...params },
      { skipNull: true }
    );

    return location.pathname + (query ? `?${query}` : "");
  };

  return (
    <VisualiserContext.Provider value={{ isOpen, open }}>
      {children}

      <Visualiser
        open={isOpen}
        contentSource={contentSource}
        onChange={(params) => handleOnChange(params)}
        onClose={() => setIsOpen(false)}
        tiles={tilesSetData}
        sidings={sidingsSetData}
        getProductLinkAction={getProductLinkAction}
        {...parsedQueryParameters}
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
