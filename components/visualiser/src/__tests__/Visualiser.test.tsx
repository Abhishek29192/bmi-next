import React from "react";
import { render } from "@testing-library/react";
import Visualiser, { sidingsSetData, tilesSetData } from "../";
import { Tile } from "../Types";

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
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when test asset url provided", () => {
    process.env.GATSBY_VISUALISER_ASSETS_URL = "jest-test-page";
    const { container } = render(
      <Visualiser
        contentSource=""
        open={false}
        tiles={tilesSetData}
        sidings={sidingsSetData}
        onClose={() => console.log("close")}
        onClick={(params) => console.log(params)}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when non-test asset url provided", () => {
    process.env.GATSBY_VISUALISER_ASSETS_URL = "http://www.google.com";
    const { container } = render(
      <Visualiser
        contentSource=""
        open={false}
        tiles={tilesSetData}
        sidings={sidingsSetData}
        onClose={() => console.log("close")}
        onClick={(params) => console.log(params)}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
