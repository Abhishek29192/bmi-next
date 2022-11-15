import { mockResponses } from "@bmi-digital/fetch-mocks";
import { createProduct } from "@bmi/elasticsearch-types";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import fetchMockJest from "fetch-mock-jest";
import React, { useEffect } from "react";
import { sidingsSetData } from "../index";
import Visualiser from "../Visualiser";
import sidingMock from "./__mocks__/siding";

const mockChildComponent = jest.fn();
jest.mock("../HouseViewer", () => ({
  __esModule: true,
  default: (props) => {
    useEffect(() => {
      props.setIsLoading(false);
    }, []);

    mockChildComponent(props);
    return <div>House viewer</div>;
  }
}));

jest.mock("../TileViewer", () => ({
  __esModule: true,
  default: (props) => {
    useEffect(() => {
      props.setIsLoading(false);
    }, []);

    return <div>Tile viewer</div>;
  }
}));

const blackTile = createProduct({
  APPEARANCEATTRIBUTES$COLOUR: [{ name: "Dark Black" }],
  GENERALINFORMATION$CLASSIFICATION: [{ name: "clay" }],
  TILESATTRIBUTES$VERTICALOVERLAP: [{ name: "10" }],
  TILESATTRIBUTES$HORIZONTALOVERLAP: [{ name: "10" }],
  TILESATTRIBUTES$HORIZONTALOFFSET: [{ name: "10" }],
  TILESATTRIBUTES$THICKNESSREDUCTION: [{ name: "10" }],
  name: "Black tile",
  code: "black_tile",
  visualiserAssets: []
});

const redTile = createProduct({
  APPEARANCEATTRIBUTES$COLOUR: [{ name: "Red" }],
  GENERALINFORMATION$CLASSIFICATION: [{ name: "clay" }],
  TILESATTRIBUTES$VERTICALOVERLAP: [{ name: "10" }],
  TILESATTRIBUTES$HORIZONTALOVERLAP: [{ name: "10" }],
  TILESATTRIBUTES$HORIZONTALOFFSET: [{ name: "10" }],
  TILESATTRIBUTES$THICKNESSREDUCTION: [{ name: "10" }],
  name: "Red tile",
  code: "red_tile",
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
    const { baseElement } = render(
      <Visualiser
        contentSource="" //TODO: Need to mock this?
        open
        sidings={sidingsSetData}
        onClose={jest.fn()}
        onClick={jest.fn()}
        houseTypes={[]}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("renders correctly when test asset url provided", () => {
    const { baseElement } = render(
      <Visualiser
        contentSource=""
        open
        sidings={sidingsSetData}
        onClose={jest.fn()}
        onClick={jest.fn()}
        houseTypes={[]}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("renders correctly when non-test asset url provided", () => {
    const { baseElement } = render(
      <Visualiser
        contentSource=""
        open
        sidings={sidingsSetData}
        onClose={jest.fn()}
        onClick={jest.fn()}
        houseTypes={[]}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("passes house types to HouseViewer", () => {
    mockResponses(fetchMock, {
      url: "*",
      method: "POST",
      status: 200,
      body: {
        hits: { hits: [{ _source: blackTile }, { _source: redTile }] }
      }
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
        tileId={blackTile.code}
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
      body: {
        hits: { hits: [{ _source: blackTile }, { _source: redTile }] }
      }
    });

    render(
      <Visualiser
        contentSource=""
        open={true}
        onClose={jest.fn()}
        houseTypes={[{ houseModel: { url: "" } }]}
        onClick={onClick}
        sidings={[]}
        shareWidget={<div>Share widget</div>}
      />
    );

    fireEvent.click(screen.getByText("visualizer.actions.selectProduct"));
    waitFor(() =>
      fireEvent.click(
        screen.getByRole("heading", { level: 6, name: blackTile.name })
      )
    );
    waitFor(() =>
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({
          tileId: blackTile.code,
          label: `${blackTile.name} + Dark Black`
        })
      )
    );
  });

  it("opens wall color selector dialog", () => {
    const onClick = jest.fn();

    render(
      <Visualiser
        viewMode="roof"
        contentSource=""
        open={true}
        onClose={jest.fn()}
        houseTypes={[{ houseModel: { url: "" } }]}
        onClick={onClick}
        sidings={[]}
      />
    );

    fireEvent.click(screen.getByText("visualizer.actions.wallColor"));
    expect(
      screen.getByText("visualizer.sidingsSelector.title")
    ).toBeInTheDocument();
  });

  it("switches to roof view mode", async () => {
    mockResponses(fetchMock, {
      url: "*",
      method: "POST",
      status: 200,
      body: {
        hits: { hits: [{ _source: blackTile }, { _source: redTile }] }
      }
    });

    render(
      <Visualiser
        viewMode="tile"
        contentSource=""
        open={true}
        onClose={jest.fn()}
        houseTypes={[{ houseModel: { url: "" } }]}
        onClick={jest.fn()}
        sidings={[]}
      />
    );

    fireEvent.click(screen.getByText("visualizer.actions.roofMode"));
    await waitFor(() =>
      expect(screen.getByText("House viewer")).toBeInTheDocument()
    );
  });

  it("switches to tile view mode", async () => {
    mockResponses(fetchMock, {
      url: "*",
      method: "POST",
      status: 200,
      body: {
        hits: { hits: [{ _source: blackTile }, { _source: redTile }] }
      }
    });

    render(
      <Visualiser
        viewMode="roof"
        contentSource=""
        open={true}
        onClose={jest.fn()}
        houseTypes={[{ houseModel: { url: "" } }]}
        onClick={jest.fn()}
        sidings={[]}
      />
    );

    fireEvent.click(screen.getByText("visualizer.actions.tileMode"));
    await waitFor(() =>
      expect(screen.getByText("Tile viewer")).toBeInTheDocument()
    );
  });

  it("selects wall", () => {
    const onClick = jest.fn();

    render(
      <Visualiser
        viewMode="roof"
        contentSource=""
        open={true}
        onClose={jest.fn()}
        houseTypes={[{ houseModel: { url: "" } }]}
        onClick={onClick}
        sidings={[sidingMock]}
      />
    );

    fireEvent.click(screen.getByText("visualizer.actions.wallColor"));
    expect(
      screen.getByText("visualizer.sidingsSelector.title")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(sidingMock.name));
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({ type: "wall-selector", label: sidingMock.name })
    );
  });

  it("calls onClick function if user clicks on 'Read more'", async () => {
    const onClick = jest.fn();
    mockResponses(fetchMock, {
      url: "*",
      method: "POST",
      status: 200,
      body: {
        hits: { hits: [{ _source: blackTile }, { _source: redTile }] }
      }
    });

    render(
      <Visualiser
        viewMode="roof"
        contentSource=""
        open={true}
        onClose={jest.fn()}
        houseTypes={[{ houseModel: { url: "" } }]}
        onClick={onClick}
        onChange={jest.fn()}
        sidings={[sidingMock]}
        tileId={blackTile.code}
      />
    );

    const readMoreBtn = await screen.findByText("visualizer.readMore");
    fireEvent.click(readMoreBtn);
    expect(onClick).toHaveBeenCalled();
  });

  it("calls onClose function if user closes modal", async () => {
    const onClose = jest.fn();

    render(
      <Visualiser
        viewMode="roof"
        contentSource=""
        open={true}
        onClose={onClose}
        houseTypes={[{ houseModel: { url: "" } }]}
        onClick={onClose}
        onChange={jest.fn()}
        sidings={[sidingMock]}
        tileId={blackTile.code}
      />
    );

    const closeBtn = screen.getByLabelText("Close");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("opens and closes share popover", async () => {
    render(
      <Visualiser
        viewMode="roof"
        contentSource=""
        open={true}
        onClose={jest.fn()}
        houseTypes={[{ houseModel: { url: "" } }]}
        onClick={jest.fn()}
        onChange={jest.fn()}
        sidings={[sidingMock]}
        shareWidget={<div>Share widget</div>}
        tileId={blackTile.code}
      />
    );

    fireEvent.click(
      document.querySelector("button[aria-describedby='share-popover']")
    );
    expect(screen.getByText("Share widget")).toBeInTheDocument();

    fireEvent.keyDown(screen.getByText("Share widget"), {
      key: "Escape",
      keyCode: 27
    });
    await waitFor(() =>
      expect(screen.queryByText("Share widget")).not.toBeInTheDocument()
    );
  });

  it("closes tile selector dialog on cross button click", async () => {
    render(
      <Visualiser
        viewMode="tile"
        contentSource=""
        open={true}
        onClose={jest.fn()}
        houseTypes={[{ houseModel: { url: "" } }]}
        onClick={jest.fn()}
        onChange={jest.fn()}
        sidings={[]}
      />
    );

    fireEvent.click(screen.getByText("visualizer.actions.selectProduct"));
    expect(
      screen.getByText("visualizer.tileSelector.title")
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByLabelText("Close")[1]);
    await waitFor(() =>
      expect(
        screen.queryByText("visualizer.tileSelector.title")
      ).not.toBeInTheDocument()
    );
  });

  it("closes wall selector dialog if the user clicks on the cross button", async () => {
    render(
      <Visualiser
        viewMode="roof"
        contentSource=""
        open={true}
        onClose={jest.fn()}
        houseTypes={[{ houseModel: { url: "" } }]}
        onClick={jest.fn()}
        onChange={jest.fn()}
        sidings={[]}
      />
    );

    fireEvent.click(screen.getByText("visualizer.actions.wallColor"));
    expect(
      screen.getByText("visualizer.sidingsSelector.title")
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByLabelText("Close")[1]);
    await waitFor(() =>
      expect(
        screen.queryByText("visualizer.sidingsSelector.title")
      ).not.toBeInTheDocument()
    );
  });
});
