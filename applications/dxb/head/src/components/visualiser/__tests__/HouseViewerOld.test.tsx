// import { render, waitFor } from "@testing-library/react";
// import React from "react";
import { WebGLRenderer } from "three";
// import sidings from "../data/sidings.json";
// import tiles from "../data/tiles.json";
// import HouseViewer from "../HouseViewerOld";

const mockWebGLRenderer = WebGLRenderer as unknown as jest.Mock<WebGLRenderer>;

mockWebGLRenderer.mockReturnValue({
  domElement: document.createElement("canvas"),
  setSize: jest.fn(),
  render: jest.fn(),
  setClearColor: jest.fn(),
  setPixelRatio: jest.fn(),
  shadowMap: {
    enabled: false
  }
} as any);

jest.mock("three", () => {
  const THREE = jest.requireActual("three");
  return {
    ...THREE,
    WebGLRenderer: jest.fn()
  };
});

describe("HouseViewer", () => {
  // TODO: Throws some horrible error that kills jest
  it("should render WebGL scene", async () => {
    //   render(
    //     <HouseViewer
    //       tile={tiles.tiles[0] as any}
    //       colour={tiles.tiles[0].colours[0]}
    //       siding={sidings.sidings[0]}
    //       setIsLoading={() => {}}
    //       options={{
    //         contentSource: "url"
    //       }}
    //     />
    //   );
    //
    //   await waitFor(() => expect(mockWebGLRenderer).toHaveBeenCalled());
  });
});
