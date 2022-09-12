global.process.env.GATSBY_ENABLE_V2_WEBTOOLS_VISUALISATOR = "true";

import { render } from "@testing-library/react";
import React from "react";
import Visualiser, { sidingsSetData, tilesSetData } from "../";
import { Tile } from "../Types";

const mockChildComponent = jest.fn();
jest.mock(".././HouseViewer", () => ({
  __esModule: true,
  default: (props) => {
    mockChildComponent(props);
    return <div />;
  }
}));

afterEach(() => {
  jest.resetModules();
});

describe("Visualiser component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Visualiser
        contentSource="" //TODO: Need to mock this?
        open={false}
        tiles={tilesSetData as Tile[]}
        sidings={sidingsSetData}
        onClose={() => console.log("close")}
        onClick={(params) => console.log(params)}
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
        tiles={tilesSetData}
        sidings={sidingsSetData}
        onClose={() => console.log("close")}
        onClick={(params) => console.log(params)}
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
        tiles={tilesSetData}
        sidings={sidingsSetData}
        onClose={() => console.log("close")}
        onClick={(params) => console.log(params)}
        houseTypes={[]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("passes house types to HouseViewer", () => {
    const houseModelUrl = "https://mock_url";
    render(
      <Visualiser
        contentSource=""
        open
        tiles={tilesSetData}
        sidings={sidingsSetData}
        onClose={jest.fn()}
        onClick={jest.fn()}
        houseTypes={[{ houseModel: { url: houseModelUrl } }]}
        viewMode="roof"
      />
    );

    expect(mockChildComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        houseModelUrl
      })
    );
  });
});
