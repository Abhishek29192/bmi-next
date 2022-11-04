import { render } from "@testing-library/react";
import React from "react";
import { WebGLRenderer } from "three";
import sidings from "../data/sidings.json";
import HouseViewer from "../HouseViewer";
import tileMock from "./__mocks__/tile";

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
  it("should render WebGL scene", () => {
    render(
      <HouseViewer
        tile={tileMock}
        siding={sidings.sidings[0]}
        setIsLoading={jest.fn()}
        options={{
          contentSource: "url"
        }}
        houseModelUrl="https://house_model"
      />
    );

    expect(mockWebGLRenderer).toHaveBeenCalled();
  });
});
