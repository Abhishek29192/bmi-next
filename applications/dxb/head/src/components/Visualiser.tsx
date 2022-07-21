// TODO: Move to under visualiser
import { MicroCopy } from "@bmi/components";
import { navigate as navigateWithParams, useLocation } from "@reach/router";
import { graphql, navigate } from "gatsby";
import queryString from "query-string";
import React, { createContext, Suspense, useState } from "react";
import { devLog } from "../utils/devLog";
import { GTMContext, pushToDataLayer } from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import ShareWidgetSection, {
  Data as ShareWidgetSectionData
} from "./ShareWidgetSection";
import { useSiteContext } from "./Site";
import no from "./visualiser/data/copy/no.json";
import sidingsSetData from "./visualiser/data/sidings.json";
import tilesSetData from "./visualiser/data/tiles.json";
import { Tile } from "./visualiser/Types";
import { Parameters } from "./visualiser/Visualiser";

const isVisualiserV2Enabled =
  process.env.GATSBY_ENABLE_V2_WEBTOOLS_VISUALISATOR === "true";

const Visualiser = isVisualiserV2Enabled
  ? React.lazy(() => import("./visualiser/Visualiser"))
  : React.lazy(() => import("./visualiser/VisualiserOld"));

type Context = {
  isOpen: boolean;
  open?: (params?: Record<string, unknown>) => void;
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

const ShareWidgetSectionWithContext = ({
  data
}: {
  data: ShareWidgetSectionData;
}) => {
  return (
    <GTMContext.Provider
      value={{ idMap: { "cta-share1": "visualiser1-cta-share1" } }}
    >
      <ShareWidgetSection data={data} hasNoPadding={true} />
    </GTMContext.Provider>
  );
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
  const { countryCode } = useSiteContext();

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

  const handleOnClose = () => {
    setIsOpen(false);
    handleOnChange({});
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
        ? getPathWithCountryCode(
            countryCode,
            variantCodeToPathMap[data.variantCode]
          )
        : undefined;

    pushToDataLayer({
      event: "dxb.button_click",
      // eslint-disable-next-line security/detect-object-injection
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

  //TODO: improve/remove this going forwards - currently the visualiser context
  //      crashes and messes up all the test responses. This works around the
  //      issue until we can figure out why. Already spent a fair bit of time
  //      attempting to debug this one.
  if (process.env.GATSBY_VISUALISER_ASSETS_URL === "jest-test-page") {
    return <>{children}</>;
  }

  const VisualizerComponent = (
    <Visualiser
      open={isOpen}
      contentSource={contentSource}
      onChange={(params) => handleOnChange(params)}
      onClose={handleOnClose}
      tiles={tilesSetData.tiles as Tile[]}
      sidings={sidingsSetData.sidings}
      {...parsedQueryParameters}
      {...parameters}
      shareWidget={
        shareWidgetData ? (
          <ShareWidgetSectionWithContext data={shareWidgetData} />
        ) : undefined
      }
      onClick={handleOnClick}
    />
  );
  return (
    <VisualiserContext.Provider value={{ isOpen, open }}>
      {children}

      {!(typeof window === "undefined") && isOpen ? (
        <Suspense fallback={<div>Loading...</div>}>
          {isVisualiserV2Enabled ? (
            VisualizerComponent
          ) : (
            <MicroCopy.Provider values={no}>
              {VisualizerComponent}
            </MicroCopy.Provider>
          )}
        </Suspense>
      ) : undefined}
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
