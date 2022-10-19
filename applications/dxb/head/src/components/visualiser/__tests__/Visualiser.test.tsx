import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import React from "react";
import { mockResponses } from "@bmi-digital/fetch-mocks";
import fetchMockJest from "fetch-mock-jest";
import { createProduct } from "@bmi/elasticsearch-types";
import { sidingsSetData } from "../index";
import Visualiser from "../Visualiser";

const mockChildComponent = jest.fn();
jest.mock(".././HouseViewer", () => ({
  __esModule: true,
  default: (props) => {
    mockChildComponent(props);
    return <div />;
  }
}));

const esProduct = createProduct({
  "APPEARANCEATTRIBUTES.COLOUR": [{ value: "Dark Black" }],
  "GENERALINFORMATION.CLASSIFICATION": [{ value: "clay" }],
  "TILESATTRIBUTES.VERTICALOVERLAP": [{ value: "10" }],
  "TILESATTRIBUTES.HORIZONTALOVERLAP": [{ value: "10" }],
  "TILESATTRIBUTES.HORIZONTALOFFSET": [{ value: "10" }],
  "TILESATTRIBUTES.THICKNESSREDUCTION": [{ value: "10" }],
  name: "Black tile",
  code: "black_tile",
  visualiserAssets: []
});

afterEach(() => {
  jest.resetModules();
});

describe("Visualiser component", () => {
  const fetchMock = fetchMockJest.sandbox();
  global.fetch = fetchMock;

  beforeEach(() => {
    fetchMock.reset();
  });

  it("renders correctly", () => {
    const { container } = render(
      <Visualiser
        contentSource="" //TODO: Need to mock this?
        open={false}
        sidings={sidingsSetData}
        onClose={() => console.log("close")}
        onClick={jest.fn()}
        houseTypes={[]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when test asset url provided", () => {
    const { container } = render(
      <Visualiser
        contentSource=""
        open={false}
        sidings={sidingsSetData}
        onClose={jest.fn()}
        onClick={jest.fn()}
        houseTypes={[]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when non-test asset url provided", () => {
    const { container } = render(
      <Visualiser
        contentSource=""
        open={false}
        sidings={sidingsSetData}
        onClose={jest.fn()}
        onClick={jest.fn()}
        houseTypes={[]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("passes house types to HouseViewer", () => {
    mockResponses(fetchMock, {
      url: "*",
      method: "POST",
      status: 200,
      body: { hits: { hits: [{ _source: esProduct }] } }
    });

    const houseModelUrl = "https://mock_url";
    render(
      <Visualiser
        contentSource=""
        open
        sidings={sidingsSetData}
        onClose={jest.fn()}
        onClick={jest.fn()}
        houseTypes={[{ houseModel: { url: houseModelUrl } }]}
        viewMode="roof"
        tileId={esProduct.code}
      />
    );

    waitFor(() =>
      expect(mockChildComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          houseModelUrl
        })
      )
    );
  });

  it("renders with share widget", () => {
    render(
      <Visualiser
        contentSource=""
        open={true}
        onClose={jest.fn()}
        houseTypes={[{ houseModel: { url: "" } }]}
        onClick={jest.fn()}
        sidings={[]}
        shareWidget={<div>Share widget</div>}
      />
    );

    expect(
      document.querySelector("button[aria-describedby='share-popover']")
    ).toBeInTheDocument();
  });

  it("opens tile selection section", () => {
    render(
      <Visualiser
        contentSource=""
        open={true}
        onClose={jest.fn()}
        houseTypes={[{ houseModel: { url: "" } }]}
        onClick={jest.fn()}
        sidings={[]}
      />
    );

    fireEvent.click(screen.getByText("visualizer.actions.selectProduct"));
    expect(
      screen.getByText("visualizer.tileSelector.title")
    ).toBeInTheDocument();
  });

  it("selects tile", () => {
    const onClick = jest.fn();
    mockResponses(fetchMock, {
      url: "*",
      method: "POST",
      status: 200,
      body: { hits: { hits: [{ _source: esProduct }] } }
    });

    render(
      <Visualiser
        contentSource=""
        open={true}
        onClose={jest.fn()}
        houseTypes={[{ houseModel: { url: "" } }]}
        onClick={onClick}
        sidings={[]}
      />
    );

    fireEvent.click(screen.getByText("visualizer.actions.selectProduct"));
    waitFor(() =>
      fireEvent.click(
        screen.getByRole("heading", { level: 6, name: esProduct.name })
      )
    );
    waitFor(() =>
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({
          tileId: esProduct.code,
          label: `${esProduct.name} + Dark Black`
        })
      )
    );
  });
});
