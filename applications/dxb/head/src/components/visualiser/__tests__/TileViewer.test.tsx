import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { MeshStandardMaterial, PerspectiveCamera, Scene, Texture } from "three";
import loadModel from "../ModelCache";
import loadTexture from "../TextureCache";
import TileViewer from "../TileViewer";
import { PIMTile } from "../Types";
import sidingMock from "./__mocks__/siding";
import tileMock from "./__mocks__/tile";
import tileModelMock from "./__mocks__/tileModel";

const tile: PIMTile = {
  ...tileMock,
  highDetailMeshRef: "",
  diffuseMapRef: "",
  normalMapRef: "",
  metallicRoughnessMapRef: ""
};

const defaultProps = {
  tile,
  siding: sidingMock,
  setIsLoading: jest.fn(),
  options: {
    contentSource: "url"
  }
};

jest.mock("three", () => {
  const THREE = jest.requireActual("three");
  return {
    ...THREE,
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      domElement: document.createElement("canvas"),
      setSize: jest.fn(),
      render: jest.fn(),
      setClearColor: jest.fn(),
      setPixelRatio: jest.fn(),
      shadowMap: {
        enabled: false
      }
    }))
  };
});

jest.mock("../TextureCache", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        resolve(new Texture());
      })
  )
}));

jest.mock("../ModelCache", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        resolve(tileModelMock);
      })
  )
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("HouseViewer", () => {
  it.skip("resets controls on rerender", async () => {
    const resetControlsMock = jest.fn();
    let tileViewerInstance;

    const { rerender } = render(
      <ThemeProvider>
        <TileViewer
          {...defaultProps}
          ref={(node) => {
            tileViewerInstance = node;
          }}
        />
      </ThemeProvider>
    );
    tileViewerInstance!.controls.reset = resetControlsMock;

    rerender(
      <ThemeProvider>
        <TileViewer {...defaultProps} />
      </ThemeProvider>
    );
    expect(resetControlsMock).toHaveBeenCalled();
  });

  describe("load method", () => {
    beforeEach(() => {
      jest
        .spyOn(TileViewer.prototype, "loadModel")
        .mockImplementation(jest.fn());
    });

    afterEach(() => {
      (TileViewer.prototype.loadModel as jest.Mock).mockReset();
    });

    it("should not create a scene if container does not exist", () => {
      const tileViewer = new TileViewer(defaultProps);
      tileViewer.container = null;
      tileViewer.load();
      expect(tileViewer.scene).toBeUndefined();
    });

    it("creates new scene if scene does not exist", () => {
      const tileViewer = new TileViewer(defaultProps);
      tileViewer.container = document.createElement("div");
      tileViewer.scene = undefined;
      tileViewer.load();
      expect(tileViewer.scene).toBeTruthy();
    });

    it("creates new renderer if renderer does not exist", () => {
      const tileViewer = new TileViewer(defaultProps);
      tileViewer.container = document.createElement("div");
      tileViewer.renderer = undefined;
      tileViewer.load();
      expect(tileViewer.renderer).toBeTruthy();
    });

    it("create new OrbitControls if controls does not exist", () => {
      const tileViewer = new TileViewer(defaultProps);
      tileViewer.container = document.createElement("div");
      tileViewer.controls = undefined;
      tileViewer.load();
      expect(tileViewer.controls).toBeTruthy();
    });

    it("calls renderFrame on controls changeEvent", async () => {
      const renderFrameSpy = jest.spyOn(TileViewer.prototype, "renderFrame");
      const tileViewer = new TileViewer(defaultProps);
      tileViewer.container = document.createElement("div");
      tileViewer.load();
      tileViewer.controls!.dispatchEvent({ type: "change" });
      //First time – on background load, second time – before loadModel method and third time on change event
      await waitFor(() => expect(renderFrameSpy).toHaveBeenCalledTimes(3));
    });

    it("sets correct camera position if isLargeTile === true", () => {
      const tileViewer = new TileViewer({
        ...defaultProps,
        tile: { ...tileMock, isLargeTile: true }
      });
      tileViewer.container = document.createElement("div");
      tileViewer.load();

      expect(tileViewer.camera!.position.x.toFixed(2)).toBe("-0.61");
      expect(tileViewer.camera!.position.y.toFixed(2)).toBe("2.55");
      expect(tileViewer.camera!.position.z.toFixed(2)).toBe("0.92");
    });

    it("sets correct camera position if isLargeTile === false", async () => {
      const tileViewer = new TileViewer({
        ...defaultProps,
        tile: { ...tileMock, isLargeTile: false }
      });
      tileViewer.container = document.createElement("div");
      tileViewer.load();

      expect(tileViewer.camera!.position.x.toFixed(2)).toBe("-0.31");
      expect(tileViewer.camera!.position.y.toFixed(2)).toBe("1.28");
      expect(tileViewer.camera!.position.z.toFixed(2)).toBe("0.46");
    });
  });

  describe("loadModel method", () => {
    const updatedProps = {
      ...defaultProps,
      tile: { ...tileMock, code: "updated_tile_code" }
    };

    it("should not call renderFrame if props and tile exist and if default tile === passed in loadModel tile", async () => {
      const renderFrameSpy = jest.spyOn(TileViewer.prototype, "renderFrame");
      const tileViewer = new TileViewer(defaultProps);
      tileViewer.tile = tileModelMock;
      await tileViewer.loadModel(defaultProps);
      expect(renderFrameSpy).not.toHaveBeenCalled();
    });

    it("loads diffuseMapRef", async () => {
      const tileViewer = new TileViewer(defaultProps);
      await tileViewer.loadModel({
        ...updatedProps,
        tile: { ...tile, diffuseMapRef: "https://diffuse_map_ref" }
      });
      expect(loadTexture).toHaveBeenCalledWith("https://diffuse_map_ref");
    });

    it("loads metallicRoughnessMapRef", async () => {
      const tileViewer = new TileViewer(defaultProps);
      await tileViewer.loadModel({
        ...updatedProps,
        tile: { ...tile, metallicRoughnessMapRef: "https://metallic_map_ref" }
      });
      expect(loadTexture).toHaveBeenCalledWith("https://metallic_map_ref");
    });

    it("loads normalMapRef", async () => {
      const tileViewer = new TileViewer(defaultProps);
      await tileViewer.loadModel({
        ...updatedProps,
        tile: { ...tile, normalMapRef: "https://normal_map_ref" }
      });
      expect(loadTexture).toHaveBeenCalledWith("https://normal_map_ref");
    });

    it("loads tile model", async () => {
      const tileViewer = new TileViewer(defaultProps);
      tileViewer.tileMaterial = new MeshStandardMaterial();
      await tileViewer.loadModel({
        ...updatedProps,
        tile: { ...tile, highDetailMeshRef: "https://tile_model.glb" }
      });
      expect(loadModel).toHaveBeenCalledWith("https://tile_model.glb");
    });

    it("sets correct camera position if tile is a large tile", async () => {
      const tileViewer = new TileViewer({
        ...defaultProps,
        tile: { ...tileMock, isLargeTile: true }
      });
      tileViewer.camera = new PerspectiveCamera();
      await tileViewer.loadModel(updatedProps);

      expect(tileViewer.camera.position.x.toFixed(2)).toBe("-0.61");
      expect(tileViewer.camera.position.y.toFixed(2)).toBe("2.55");
      expect(tileViewer.camera.position.z.toFixed(2)).toBe("0.92");
    });

    it("sets correct camera position if tile is not a large tile", async () => {
      const tileViewer = new TileViewer({
        ...defaultProps,
        tile: { ...tileMock, isLargeTile: false }
      });
      tileViewer.camera = new PerspectiveCamera();
      await tileViewer.loadModel(updatedProps);

      expect(tileViewer.camera.position.x.toFixed(2)).toBe("-0.31");
      expect(tileViewer.camera.position.y.toFixed(2)).toBe("1.28");
      expect(tileViewer.camera.position.z.toFixed(2)).toBe("0.46");
    });

    it("removes tile from the scene if tile already exists", async () => {
      const tileViewer = new TileViewer(defaultProps);
      tileViewer.tile = tileModelMock;
      tileViewer.scene = new Scene();
      const removeSceneMock = jest.fn();
      tileViewer.scene.remove = removeSceneMock;

      await tileViewer.loadModel(updatedProps);
      expect(removeSceneMock).toHaveBeenCalledWith(tileModelMock.scene);
    });
  });
});
