import React, { createContext, useContext, useState } from "react";
import queryString from "query-string";
import Visualiser, {
  Parameters,
  tilesSetData,
  sidingsSetData
} from "@bmi/visualiser";
import { navigate, graphql } from "gatsby";
import { navigate as navigateWithParams, useLocation } from "@reach/router";
import { devLog } from "../utils/devLog";
import { getProductUrl } from "../utils/product-details-transforms";
import { pushToDataLayer } from "../utils/google-tag-manager";
import { SiteContext } from "./Site";
import ShareWidgetSection, {
  Data as ShareWidgetSectionData
} from "./ShareWidgetSection";

type Context = {
  isOpen: boolean;
  open?: (params?: object) => void;
};

const GtmEventsMap = {
  "product-selector": "visualiser1-product-selector",
  "product-link": "visualiser1-product-link",
  "wall-selector": "visualiser1-wall-selector",
  "bottom-menu": "visualiser1-bottom-menu"
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
  shareWidgetData?: ShareWidgetSectionData;
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
  variantCodeToPathMap = {},
  shareWidgetData
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

  const handleOnChange = ({
    isOpen,
    ...params
  }: Partial<Parameters & { isOpen: boolean }>) => {
    navigateWithParams(
      isOpen ? calculatePathFromData(params) : calculatePathFromData({})
    );
  };

  const handleOnClick = ({ type, label, data, ...params }) => {
    const productPath =
      data && data.variantCode
        ? getProductUrl(countryCode, variantCodeToPathMap[data.variantCode])
        : undefined;

    pushToDataLayer({
      id: GtmEventsMap[type],
      label,
      action: productPath ? productPath : calculatePathFromData(params)
    });

    if (productPath) {
      navigate(productPath);
    }
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
        {...parsedQueryParameters}
        {...parameters}
        shareWidget={
          shareWidgetData ? (
            <ShareWidgetSection data={shareWidgetData} hasNoPadding={true} />
          ) : undefined
        }
        onClick={handleOnClick}
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
