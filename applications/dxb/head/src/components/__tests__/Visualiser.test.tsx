import { ThemeProvider, Button } from "@bmi-digital/components";
import React from "react";
import { mockResponses } from "@bmi-digital/fetch-mocks";
import { createProduct, Product } from "@bmi/elasticsearch-types";
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router";
import { fireEvent, render as rtlRender, screen } from "@testing-library/react";
import fetchMockJest from "fetch-mock-jest";
import * as Gatsby from "gatsby";
import { SiteContextProvider } from "../Site";
import { shareWidgetData } from "../../templates/simplePage/__mocks__/simplePage";
import { Data as ShareWidgetSectionData } from "../ShareWidgetSection";
import Visualiser, { VisualiserContext } from "../Visualiser";
import { ConfigProvider, EnvConfig } from "../../contexts/ConfigProvider";
import { devLog } from "../../utils/devLog";
import { getMockSiteContext } from "./utils/SiteContextProvider";

const navigateSpy = jest.spyOn(Gatsby, "navigate");
window.history.replaceState = jest.fn();

jest.mock("../../utils/devLog");

jest.mock("../visualiser/HouseViewer", () => ({
  ...jest.requireActual<Record<string, unknown>>("../visualiser/HouseViewer"),
  __esModule: true,
  default: () => <div>HouseViewer mock</div>
}));

jest.mock("../visualiser/TileViewer", () => ({
  ...jest.requireActual<Record<string, unknown>>("../visualiser/TileViewer"),
  __esModule: true,
  default: () => <div>TileViewer mock</div>
}));

const tile = createProduct({
  APPEARANCEATTRIBUTES$COLOUR: [{ name: "Red" }],
  GENERALINFORMATION$CLASSIFICATION: [{ name: "clay" }],
  TILESATTRIBUTES$VERTICALOVERLAP: [{ name: "10" }],
  TILESATTRIBUTES$HORIZONTALOVERLAP: [{ name: "10" }],
  TILESATTRIBUTES$HORIZONTALOFFSET: [{ name: "10" }],
  TILESATTRIBUTES$THICKNESSREDUCTION: [{ name: "10" }],
  name: "Red tile",
  code: "red_tile",
  path: "/p/red_tile/",
  visualiserAssets: []
});

const fetchMock = fetchMockJest.sandbox();
global.fetch = fetchMock;

const mockDataRequest = (product: Product = tile) => {
  mockResponses(fetchMock, {
    url: "*",
    method: "POST",
    status: 200,
    body: {
      hits: { hits: [{ _source: product }] }
    }
  });
};

afterEach(() => {
  navigateSpy.mockRestore();
  fetchMock.reset();
  jest.clearAllMocks();
});

beforeAll(() => {
  require("../visualiser/Visualiser");
  require("../visualiser/VisualiserOld");
});

const renderWithProvider = (
  children: JSX.Element,
  {
    config,
    route = `/no?tileId=${tile.code}`
  }: {
    config?: EnvConfig["config"];
    route?: string;
  }
) => {
  const history = createHistory(createMemorySource(route));

  const utils = rtlRender(
    <ConfigProvider configObject={config}>
      <ThemeProvider>
        <LocationProvider history={history}>
          <SiteContextProvider value={getMockSiteContext("no")}>
            {children}
          </SiteContextProvider>
        </LocationProvider>
      </ThemeProvider>
    </ConfigProvider>
  );

  return { ...utils, history };
};

describe("VisualiserProvider", () => {
  describe("when isVisualiserV2Enabled === true", () => {
    const config = { isV2VisualiserEnabled: true };
    it("navigates to correct pdp page using tile's path", async () => {
      mockDataRequest();
      renderWithProvider(
        <Visualiser
          contentSource="https://mock_url"
          houseTypes={[]}
          variantCodeToPathMap={{ [tile.code]: "" }}
        >
          <div />
        </Visualiser>,
        { config }
      );

      const navigationBtn = await screen.findByText("visualizer.readMore");
      fireEvent.click(navigationBtn);
      expect(navigateSpy).toHaveBeenCalledWith(`/no${tile.path}`);
    });

    it("navigates to correct pdp page using variantCodeToPathMap property", async () => {
      mockDataRequest({ ...tile, path: "" });
      renderWithProvider(
        <Visualiser
          contentSource="https://mock_url"
          houseTypes={[]}
          variantCodeToPathMap={{ [tile.code]: "/p/mocked-product-page" }}
        >
          <div />
        </Visualiser>,
        { config }
      );

      const navigationBtn = await screen.findByText("visualizer.readMore");
      fireEvent.click(navigationBtn);
      expect(navigateSpy).toHaveBeenCalledWith("/no/p/mocked-product-page/");
    });

    it("should not navigate to the product page if pathWithCountryCode is undefined", async () => {
      mockDataRequest({ ...tile, code: "", path: "" });
      renderWithProvider(
        <Visualiser
          contentSource="https://mock_url"
          houseTypes={[]}
          variantCodeToPathMap={{}}
        >
          <div />
        </Visualiser>,
        { config }
      );

      const navigationBtn = await screen.findByText("visualizer.readMore");
      fireEvent.click(navigationBtn);
      expect(navigateSpy).toHaveBeenCalledTimes(0);
    });

    it("renders and opens share widget", async () => {
      renderWithProvider(
        <Visualiser
          contentSource="https://mock_url"
          houseTypes={[]}
          variantCodeToPathMap={{}}
          shareWidgetData={shareWidgetData as ShareWidgetSectionData}
        >
          <div />
        </Visualiser>,
        { config }
      );

      const sharePopover = await screen.findByLabelText(
        "visualizer.sharePopover.accessibilityLabel"
      );
      fireEvent.click(sharePopover);
      expect(screen.getByText(`${shareWidgetData.title}:`)).toBeInTheDocument();
    });

    it("removes visualiser-related parameters from thr URLS if the user closes visualiser", async () => {
      renderWithProvider(
        <Visualiser
          contentSource="https://mock_url"
          houseTypes={[]}
          variantCodeToPathMap={{}}
        >
          <div />
        </Visualiser>,
        { config }
      );

      const closeBtn = await screen.findByLabelText("Close");
      fireEvent.click(closeBtn);
      expect(window.history.replaceState).toHaveBeenCalledWith(
        expect.anything(),
        null,
        "/no"
      );
    });

    it("opens visualiser on button click", async () => {
      renderWithProvider(
        <Visualiser
          contentSource="https://mock_url"
          houseTypes={[]}
          variantCodeToPathMap={{}}
        >
          <VisualiserContext.Consumer>
            {(ctx) => (
              <Button onClick={() => ctx.open()}>Open Visualiser</Button>
            )}
          </VisualiserContext.Consumer>
        </Visualiser>,
        { config, route: "/no" }
      );

      const openVisualiserBtn = await screen.findByText("Open Visualiser");
      fireEvent.click(openVisualiserBtn);
      const closeBtn = await screen.findByLabelText("Close");
      expect(closeBtn).toBeInTheDocument();
    });
  });

  describe("when isV2VisualiserEnabled === false", () => {
    it("works correctly if isV2VisualiserEnabled === false", async () => {
      renderWithProvider(
        <Visualiser
          contentSource="https://mock_url"
          houseTypes={[]}
          variantCodeToPathMap={{}}
        >
          <div />
        </Visualiser>,
        { config: { isV2VisualiserEnabled: false } }
      );

      const btn = await screen.findByLabelText("Close");
      expect(btn).toBeInTheDocument();
    });
  });
});

describe("VisualiserContext", () => {
  it("works correctly with default open method if GATSBY_VISUALISER_ASSETS_URL exists", () => {
    const defaultAssetsUrl = process.env.GATSBY_VISUALISER_ASSETS_URL;
    process.env.GATSBY_VISUALISER_ASSETS_URL = "https://fake_url";

    rtlRender(
      <ThemeProvider>
        <VisualiserContext.Consumer>
          {(ctx) => <Button onClick={ctx.open}>Open Visualiser</Button>}
        </VisualiserContext.Consumer>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText("Open Visualiser"));
    expect(devLog).toHaveBeenCalledWith("Visualiser: Something went wrong");
    process.env.GATSBY_VISUALISER_ASSETS_URL = defaultAssetsUrl;
  });

  it("works correctly with default open method if GATSBY_VISUALISER_ASSETS_URL does not exist", () => {
    const defaultAssetsUrl = process.env.GATSBY_VISUALISER_ASSETS_URL;
    process.env.GATSBY_VISUALISER_ASSETS_URL = "";

    rtlRender(
      <ThemeProvider>
        <VisualiserContext.Consumer>
          {(ctx) => <Button onClick={ctx.open}>Open Visualiser</Button>}
        </VisualiserContext.Consumer>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText("Open Visualiser"));
    expect(devLog).toHaveBeenCalledWith(
      "Visualiser: Make sure you define GATSBY_VISUALISER_ASSETS_URL in the .env.development file."
    );
    process.env.GATSBY_VISUALISER_ASSETS_URL = defaultAssetsUrl;
  });
});
