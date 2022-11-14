import { render, waitFor } from "@testing-library/react";
import React from "react";
import {
  AxesHelper,
  WebGLRenderer,
  Texture,
  Group,
  Scene,
  MeshStandardMaterial,
  Mesh,
  Box3,
  Vector3,
  PlaneGeometry,
  InstancedMesh,
  Object3D
} from "three";
import HouseViewer, { Props as HouseViewerProps } from "../HouseViewer";
import loadTexture from "../TextureCache";
import cacheModel from "../ModelCache";
import sidingMock from "./__mocks__/siding";
import tileMock from "./__mocks__/tile";
import houseModelMock from "./__mocks__/houseModel";
import tileModelMock from "./__mocks__/tileModel";

const houseModelUrl = "https://house_model.glb";
const defaultProps: HouseViewerProps = {
  siding: sidingMock,
  tile: tileMock,
  setIsLoading: jest.fn(),
  options: { contentSource: "https://content-source" },
  houseModelUrl
};

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
    WebGLRenderer: jest.fn(),
    AxesHelper: jest.fn()
  };
});

jest.mock("../ModelCache", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../TextureCache", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        resolve(new Texture());
      })
  )
}));

jest.mock("../GetRef", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((url: string) => url)
}));

describe("Visualiser HouseViewer", () => {
  beforeEach(() => {
    (cacheModel as jest.Mock).mockImplementation(
      (url: string) =>
        new Promise((resolve) => {
          if (url === houseModelUrl) {
            resolve(houseModelMock);
            return;
          }

          resolve(tileModelMock);
        })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("load method", () => {
    let loadModelSpy;
    beforeEach(() => {
      loadModelSpy = jest
        .spyOn(HouseViewer.prototype, "loadModel")
        .mockImplementation(jest.fn());
    });

    it("sets isLoading to false if houseModel doesn't exist", () => {
      const setIsLoadingSpy = jest.spyOn(HouseViewer.prototype, "setIsLoading");
      const houseViewer = new HouseViewer({
        ...defaultProps,
        houseModelUrl: undefined
      });
      houseViewer.load();
      expect(setIsLoadingSpy).toHaveBeenCalledWith(false);
    });

    it("should not create a scene if container does not exist", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.container = null;
      houseViewer.load();
      expect(houseViewer.scene).toBeUndefined();
    });

    it("creates new scene if scene does not exist", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.container = document.createElement("div");
      houseViewer.scene = null;
      houseViewer.load();
      expect(houseViewer.scene).toBeTruthy();
    });

    it("creates AxesHelper in dev mode", () => {
      const initialNodeEnvValue = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.scene = null;
      houseViewer.container = document.createElement("div");
      houseViewer.load();
      expect(AxesHelper).toHaveBeenCalled();
      process.env.NODE_ENV = initialNodeEnvValue;
    });

    it("creates new PerspectiveCamera if camera does not exist", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.container = document.createElement("div");
      houseViewer.camera = null;
      houseViewer.load();
      expect(houseViewer.camera).toBeTruthy();
    });

    it("creates new renderer if renderer does not exist", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.container = document.createElement("div");
      houseViewer.renderer = null;
      houseViewer.load();
      expect(houseViewer.renderer).toBeTruthy();
    });

    it("create new OrbitControls if controls does not exist", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.container = document.createElement("div");
      houseViewer.controls = null;
      houseViewer.load();
      expect(houseViewer.controls).toBeTruthy();
    });

    it("loads house model and calls loadModel method", async () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.container = document.createElement("div");
      houseViewer.houseLoader = null;
      houseViewer.load();
      expect(cacheModel).toHaveBeenCalledWith("https://house_model.glb");
      await waitFor(() => expect(loadModelSpy).toHaveBeenCalled());
    });

    it("sets isLoading to false if cannot fetch a house model", async () => {
      const setLoadingSpy = jest.spyOn(HouseViewer.prototype, "setIsLoading");
      (cacheModel as jest.Mock).mockRejectedValue("Error");

      render(<HouseViewer {...defaultProps} />);
      await waitFor(() => expect(setLoadingSpy).toHaveBeenCalledWith(false));
    });
  });

  describe("loadModel method", () => {
    let loadHouseSpy;
    let loadSidingSpy;

    beforeEach(() => {
      loadHouseSpy = jest
        .spyOn(HouseViewer.prototype, "loadHouse")
        .mockImplementation(jest.fn());

      loadSidingSpy = jest
        .spyOn(HouseViewer.prototype, "loadHouse")
        .mockImplementation(jest.fn());
    });

    it("calls loadHouse method", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.setState((prev) => ({ ...prev, tileCode: undefined }));
      houseViewer.loadModel(defaultProps);
      expect(loadHouseSpy).toHaveBeenCalled();
    });

    it("calls loadSiding method", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.setState((prev) => ({ ...prev, siding: undefined }));
      houseViewer.loadModel(defaultProps);
      expect(loadSidingSpy).toHaveBeenCalled();
    });
  });

  describe("loadSiding method", () => {
    it("loads diffuseMap texture", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.loadSiding({
        ...sidingMock,
        diffuseMapRef: "https://diffuse_map_url"
      });
      expect(loadTexture).toHaveBeenCalledWith("https://diffuse_map_url");
    });

    it("loads metallicMap texture", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.loadSiding({
        ...sidingMock,
        metallicRoughnessMapRef: "https://metallic_map_url"
      });
      expect(loadTexture).toHaveBeenCalledWith("https://metallic_map_url");
    });

    it("loads normalMap texture", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.loadSiding({
        ...sidingMock,
        normalMapRef: "https://normal_map_url"
      });
      expect(loadTexture).toHaveBeenCalledWith("https://normal_map_url");
    });

    it("updates walls material", async () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.walls = new Mesh();
      houseViewer.walls.material = undefined;
      await houseViewer.loadSiding({
        ...sidingMock,
        diffuseMapRef: "https://diffues_map_url",
        normalMapRef: "https://normal_map_url",
        metallicRoughnessMapRef: "https://metallic_map_url"
      });
      expect(houseViewer.walls.material).toBeTruthy();
    });
  });

  describe("loadHouse method", () => {
    let generateRoofSpy;

    beforeEach(() => {
      HouseViewer.prototype.snowFences = [];
      generateRoofSpy = jest
        .spyOn(HouseViewer.prototype, "generateRoof")
        .mockImplementation(jest.fn());
    });

    it("loads metallicRoughnessMap texture", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.loadHouse({
        ...tileMock,
        metallicRoughnessMapRef: "https://metallic_map_url"
      });
      expect(loadTexture).toHaveBeenCalledWith("https://metallic_map_url");
    });

    it("loads normalMap texture", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.loadHouse({
        ...tileMock,
        normalMapRef: "https://normal_map_url"
      });
      expect(loadTexture).toHaveBeenCalledWith("https://normal_map_url");
    });

    it("loads diffuseMap texture", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.loadHouse({
        ...tileMock,
        diffuseMapRef: "https://diffuse_map_url"
      });
      expect(loadTexture).toHaveBeenCalledWith("https://diffuse_map_url");
    });

    it("loads tile model", async () => {
      const houseViewer = new HouseViewer(defaultProps);
      await houseViewer.loadHouse({
        ...tileMock,
        diffuseMapRef: "https://diffuse_map_url",
        lowDetailMeshRef: "https://tileModel.glb"
      });
      expect(cacheModel).toHaveBeenCalledWith("https://tileModel.glb");
    });

    it("loads ridge model", async () => {
      const houseViewer = new HouseViewer(defaultProps);
      await houseViewer.loadHouse({
        ...tileMock,
        diffuseMapRef: "https://diffuse_map_url",
        lowDetailMeshRef: "https://tileModel.glb",
        ridgeRef: "https://ridge.glb"
      });
      expect(cacheModel).toHaveBeenCalledWith("https://ridge.glb");
    });

    it("loads all models and calls generateRoof method", async () => {
      const houseViewer = new HouseViewer(defaultProps);
      await houseViewer.loadHouse({
        ...tileMock,
        diffuseMapRef: "https://diffuse_map_url",
        lowDetailMeshRef: "https://tileModel.glb",
        ridgeRef: "https://ridge.glb",
        ridgeEndRef: "https://ridgeEnd.glb"
      });
      expect(generateRoofSpy).toHaveBeenCalled();
    });

    it("updates fences", async () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.snowFences = [new Object3D()];
      await houseViewer.loadHouse({ ...tileMock, snowFenceActive: true });
      expect(houseViewer.snowFences[0].visible).toBeTruthy();
    });
  });

  describe("propsChanged method", () => {
    it("returns false", () => {
      const houseViewer = new HouseViewer(defaultProps);
      expect(houseViewer.propsChanged(defaultProps)).toBeFalsy();
    });

    it("returns true if tiles are not equal", () => {
      const houseViewer = new HouseViewer(defaultProps);
      expect(
        houseViewer.propsChanged({
          ...defaultProps,
          tile: { ...tileMock, code: "1111111" }
        })
      ).toBeTruthy();
    });

    it("returns true if sidings are not equal", () => {
      const houseViewer = new HouseViewer(defaultProps);
      expect(
        houseViewer.propsChanged({
          ...defaultProps,
          siding: { ...sidingMock, id: 11111 }
        })
      ).toBeTruthy();
    });
  });

  describe("generateRoof method", () => {
    let ridgeMesh;
    const roofSegment = new Mesh(new PlaneGeometry(1, 1));
    const tileMesh = new Mesh(new PlaneGeometry(1, 1));
    const ridgeEndMesh = new Mesh(new PlaneGeometry(1, 1));
    tileMesh.geometry.boundingBox = new Box3(
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1)
    );

    beforeEach(() => {
      ridgeMesh = new Mesh(new PlaneGeometry(1, 1));
      ridgeMesh.geometry.boundingBox = new Box3(
        new Vector3(0, 0, 0),
        new Vector3(1, 1, 1)
      );
      ridgeEndMesh.geometry.boundingBox = new Box3(
        new Vector3(1, 2, 3),
        new Vector3(1, 2, 3)
      );
      roofSegment.geometry.boundingBox = new Box3(
        new Vector3(-5, -5, -5),
        new Vector3(5, 5, 5)
      );
    });

    it("should not add rof segments with no boundingBox", () => {
      const houseViewer = new HouseViewer(defaultProps);
      roofSegment.geometry.boundingBox = null;
      houseViewer.roofSegments = [roofSegment];
      houseViewer.generateRoof(
        tileMock,
        new MeshStandardMaterial(),
        tileMesh,
        null
      );

      expect(houseViewer.roof.children.length).toBe(0);
    });

    it("removes roof from the scene if roof already exists", () => {
      const scene = new Scene();
      const removeScene = jest.fn();
      scene.remove = removeScene;
      const roof = new Group();
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.roof = roof;
      houseViewer.scene = scene;
      houseViewer.roofSegments = [];

      houseViewer.generateRoof(
        tileMock,
        new MeshStandardMaterial(),
        tileMesh,
        ridgeMesh
      );
      expect(removeScene).toHaveBeenCalledWith(roof);
    });

    it("adds roof segments to the roof", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.roofSegments = [roofSegment];

      houseViewer.generateRoof(
        tileMock,
        new MeshStandardMaterial(),
        tileMesh,
        ridgeMesh
      );
      expect(houseViewer.roof.children.length).toBe(1);
    });

    it("should not add ridge tile to the roof if ridgeMesh doesn't have boundingBox property", () => {
      ridgeMesh.geometry.boundingBox = undefined;
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.roofSegments = [];
      houseViewer.ridges = [ridgeMesh];

      houseViewer.generateRoof(
        tileMock,
        new MeshStandardMaterial(),
        new Mesh(),
        ridgeMesh
      );

      expect(houseViewer.roof).toBe(undefined);
    });

    it("filters out ridges without boundingBox property", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.roofSegments = [];
      houseViewer.ridges = [
        new Mesh(undefined),
        ridgeMesh,
        new Mesh(undefined),
        ridgeMesh
      ];

      houseViewer.generateRoof(
        tileMock,
        new MeshStandardMaterial(),
        new Mesh(),
        ridgeMesh
      );
      expect(houseViewer.roof.children.length).toBe(2);
    });

    it("adds ridgeEnd", () => {
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.roofSegments = [];
      houseViewer.ridges = [ridgeMesh];

      houseViewer.generateRoof(
        tileMock,
        new MeshStandardMaterial(),
        new Mesh(),
        ridgeMesh,
        ridgeEndMesh
      );
      const ridgeEnd = houseViewer.roof.children[0].children.find(
        (i) => ((i as InstancedMesh).geometry.uuid = ridgeEndMesh.geometry.uuid)
      );
      expect(ridgeEnd).toBeTruthy();
    });

    it("adds ridgeEnd without boundingBox", () => {
      ridgeEndMesh.geometry.boundingBox = null;
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.roofSegments = [];
      houseViewer.ridges = [ridgeMesh];

      houseViewer.generateRoof(
        tileMock,
        new MeshStandardMaterial(),
        new Mesh(),
        ridgeMesh,
        ridgeEndMesh
      );
      const ridgeEnd = houseViewer.roof.children[0].children.find(
        (i) => ((i as InstancedMesh).geometry.uuid = ridgeEndMesh.geometry.uuid)
      );
      expect(ridgeEnd).toBeTruthy();
    });

    it("returns correct data if ridgeMesh doesn't have Z coordinate", () => {
      ridgeMesh.geometry.boundingBox.max.z = undefined;
      const houseViewer = new HouseViewer(defaultProps);
      houseViewer.roofSegments = [];
      houseViewer.ridges = [ridgeMesh];

      houseViewer.generateRoof(
        tileMock,
        new MeshStandardMaterial(),
        new Mesh(),
        ridgeMesh,
        ridgeEndMesh
      );

      expect(houseViewer.roof.children.length).toBe(1);
    });
  });
});
