// TODO: Move to under visualiser
import MicroCopy from "@bmi-digital/components/micro-copy";
import { navigate as navigateWithParams, useLocation } from "@reach/router";
import { graphql, navigate } from "gatsby";
import queryString from "query-string";
import React, { Suspense, createContext, useMemo, useState } from "react";
import { useConfig } from "../contexts/ConfigProvider";
import { devLog } from "../utils/devLog";
import { GTMContext, pushToDataLayer } from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import ShareWidgetSection, {
  Data as ShareWidgetSectionData
} from "./ShareWidgetSection";
import { useSiteContext } from "./Site";
import { HouseType, Tile } from "./visualiser/Types";
import no from "./visualiser/data/copy/no.json";
import sidingsSetData from "./visualiser/data/sidings.json";
import tilesSetData from "./visualiser/data/tiles.json";
import type { Parameters } from "./visualiser/Visualiser";

const Visualiser = React.lazy(() => import("./visualiser/Visualiser"));
const VisualiserOld = React.lazy(() => import("./visualiser/VisualiserOld"));

type Context = {
  isOpen: boolean;
  open?: (params: Record<string, unknown> | null) => void;
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
        "Visualiser: Make sure you define GATSBY_VISUALISER_ASSETS_URL in the .env.development file."
      );
      return;
    }
    devLog("Visualiser: Something went wrong");
  }
});

export type Props = {
  children: React.ReactNode;
  contentSource?: string;
  variantCodeToPathMap: Record<string, string>;
  shareWidgetData?: ShareWidgetSectionData;
  houseTypes: HouseType[] | null;
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
  shareWidgetData,
  houseTypes
}: Props) => {
  const { isV2VisualiserEnabled } = useConfig();
  const location = useLocation();

  const parsedQueryParameters = mapParameters(
    queryString.parse(location.search, { parseNumbers: true })
  );

  const [isOpen, setIsOpen] = useState(
    Object.values(parsedQueryParameters).some(Boolean)
  );
  const [parameters, setParameters] = useState<Partial<Parameters>>({});
  const { countryCode } = useSiteContext();
  const Component = useMemo(() => {
    return isV2VisualiserEnabled ? Visualiser : VisualiserOld;
  }, [isV2VisualiserEnabled]);

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
    const pathWithCountryCode =
      data?.productPath || data?.variantCode
        ? getPathWithCountryCode(
            countryCode,
            variantCodeToPathMap[data.variantCode] || data.productPath
          )
        : undefined;

    pushToDataLayer({
      event: "dxb.button_click",
      // eslint-disable-next-line security/detect-object-injection
      id: GtmEventsMap[type],
      label,
      action: pathWithCountryCode || calculatePathFromData(params)
    });

    if (pathWithCountryCode) {
      navigate(pathWithCountryCode);
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

  const VisualizerComponent = (
    <Component
      open={isOpen}
      contentSource={contentSource}
      onChange={(params) => handleOnChange(params)}
      onClose={handleOnClose}
      tiles={tilesSetData.tiles as Tile[]}
      sidings={sidingsSetData.sidings}
      houseTypes={houseTypes}
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
          {isV2VisualiserEnabled ? (
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
