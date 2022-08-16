import { render } from "@testing-library/react";
import React from "react";
import { sidingsSetData, tilesSetData } from "../";
import { Tile } from "../Types";
import Visualiser from "../VisualiserOld";

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

  it("renders correctly when open", () => {
    const { container } = render(
      <Visualiser
        contentSource="" //TODO: Need to mock this?
        open={true}
        tiles={tilesSetData as Tile[]}
        sidings={sidingsSetData}
        onClose={() => console.log("close")}
        onClick={(params) => console.log(params)}
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
      />
    );
    expect(container).toMatchSnapshot();
  });
});
