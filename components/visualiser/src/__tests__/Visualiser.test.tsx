import React from "react";
import { render } from "@testing-library/react";
import Visualiser, { tilesSetData, sidingsSetData } from "../";
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
    expect(container.firstChild).toMatchSnapshot();
  });
});
