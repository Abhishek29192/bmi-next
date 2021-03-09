import React from "react";
import { render } from "@testing-library/react";
import Visualiser, { tilesSetData, sidingsSetData } from "../";

describe("Visualiser component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Visualiser
        contentSource="" //TODO: Need to mock this?
        open={false}
        tiles={tilesSetData}
        sidings={sidingsSetData}
        onClose={() => console.log("close")}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
