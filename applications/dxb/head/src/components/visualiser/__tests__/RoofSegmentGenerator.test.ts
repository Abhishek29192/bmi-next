import {
  Box3,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Vector3
} from "three";
import generateSegment from "../RoofSegmentGenerator";
import { PIMTile } from "../Types";

const roofMesh = new Mesh(
  new PlaneGeometry(10, 10),
  new MeshStandardMaterial()
);

roofMesh.position.set(0, 0, 0);
roofMesh.rotation.set(0.5, 0, 0);

const tileMesh = new Mesh(new PlaneGeometry(1, 1), new MeshStandardMaterial());

const tileInfo = { name: "Tile" } as PIMTile;
const tileMaterial = new MeshStandardMaterial();

describe("generateSegment", () => {
  beforeEach(() => {
    roofMesh.geometry.boundingBox = new Box3(
      new Vector3(-5, -5, -5),
      new Vector3(5, 5, 5)
    );
    tileMesh.geometry.boundingBox = new Box3(
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1)
    );
  });

  it("should return undefined if roof mesh doesn't have boundingBox", () => {
    roofMesh.geometry.boundingBox = null;
    const segment = generateSegment(roofMesh, tileMesh, tileInfo, tileMaterial);
    expect(segment).toBeUndefined();
  });

  it("should return undefined if tile mesh doesn't have boundingBox", () => {
    tileMesh.geometry.boundingBox = null;
    const segment = generateSegment(roofMesh, tileMesh, tileInfo, tileMaterial);
    expect(segment).toBeUndefined();
  });

  it("should return roof segment", () => {
    const segment = generateSegment(roofMesh, tileMesh, tileInfo, tileMaterial);
    expect(segment).not.toBeUndefined();
  });

  it("roof segment should have same position as roofMesh", () => {
    const segment = generateSegment(roofMesh, tileMesh, tileInfo, tileMaterial);
    expect(segment.position.equals(roofMesh.position)).toBe(true);
  });

  it("roof segment should have same rotation as roofMesh", () => {
    const segment = generateSegment(roofMesh, tileMesh, tileInfo, tileMaterial);
    expect(segment.rotation.equals(roofMesh.rotation)).toBe(true);
  });

  it("should render 100 primary tiles on roof", () => {
    const segment = generateSegment(roofMesh, tileMesh, tileInfo, tileMaterial);

    const primaryTilesMesh = segment.getObjectByName(
      "primaryTilesMesh"
    ) as InstancedMesh;

    expect(primaryTilesMesh.count).toBe(100);
  });

  it("should render 10 end of primary row tiles on roof", () => {
    const segment = generateSegment(roofMesh, tileMesh, tileInfo, tileMaterial);

    const endOfPrimaryRowTileMesh = segment.children.filter(
      (seg) => seg.name === "endOfPrimaryRowTileMesh"
    )[0] as InstancedMesh;

    expect(endOfPrimaryRowTileMesh.count).toBe(10);
  });

  it("renders with one additional row", () => {
    tileMesh.geometry.boundingBox.max.z = 0;
    tileMesh.geometry.boundingBox.max.z = 1.7;
    const segment = generateSegment(roofMesh, tileMesh, tileInfo, tileMaterial);

    const primaryTilesMesh = segment.getObjectByName(
      "primaryTilesMesh"
    ) as InstancedMesh;
    expect(primaryTilesMesh.count).toBe(60);
  });

  it("returns correct data when tile has horizontal offset", () => {
    const segment = generateSegment(
      roofMesh,
      tileMesh,
      { ...tileInfo, horizontalOffset: 0.5 },
      tileMaterial
    );

    const endOfSecondaryRow = segment.getObjectByName(
      "endOfSecondaryRowTileMesh"
    ) as InstancedMesh;
    const startOfSecondaryRow = segment.getObjectByName(
      "startOfSecondaryRowTileMesh"
    ) as InstancedMesh;
    expect(endOfSecondaryRow).toBeTruthy();
    expect(startOfSecondaryRow).toBeTruthy();
  });

  it("returns correct data if invert === true and invertY === true", () => {
    const segment = generateSegment(
      roofMesh,
      tileMesh,
      { ...tileInfo, invert: true, invertY: true },
      tileMaterial
    );

    const primaryTilesMesh = segment.getObjectByName(
      "primaryTilesMesh"
    ) as InstancedMesh;
    expect(primaryTilesMesh.count).toBe(100);
  });

  describe("returns correct amount of tiles when tile has verticalOverlap", () => {
    it("ignores verticalOverlap if it is less then 0", () => {
      const segment = generateSegment(
        roofMesh,
        tileMesh,
        { ...tileInfo, verticalOverlap: -0.5 },
        tileMaterial
      );

      const primaryTilesMesh = segment.getObjectByName(
        "primaryTilesMesh"
      ) as InstancedMesh;

      expect(primaryTilesMesh.count).toBe(100);
    });

    it("returns correct amount of primary tiles if verticalOverlap is greater then 0 and less then 0.9", () => {
      const segment = generateSegment(
        roofMesh,
        tileMesh,
        { ...tileInfo, verticalOverlap: 0.5 },
        tileMaterial
      );

      const primaryTilesMesh = segment.getObjectByName(
        "primaryTilesMesh"
      ) as InstancedMesh;

      expect(primaryTilesMesh.count).toBe(200);
    });

    it("returns correct amount of primary tiles if verticalOverlap is greater then 0.9", () => {
      const segment = generateSegment(
        roofMesh,
        tileMesh,
        { ...tileInfo, verticalOverlap: 1.5 },
        tileMaterial
      );

      const primaryTilesMesh = segment.getObjectByName(
        "primaryTilesMesh"
      ) as InstancedMesh;

      expect(primaryTilesMesh.count).toBe(1000);
    });
  });

  describe("when roof X rotation is negative", () => {
    beforeAll(() => {
      roofMesh.rotation.x = -0.5;
    });

    it("should render 100 primary tiles on roof", () => {
      const segment = generateSegment(
        roofMesh,
        tileMesh,
        tileInfo,
        tileMaterial
      );

      const primaryTilesMesh = segment.getObjectByName(
        "primaryTilesMesh"
      ) as InstancedMesh;

      expect(primaryTilesMesh.count).toBe(100);
    });

    it("should render 10 end of primary row tiles on roof", () => {
      const segment = generateSegment(
        roofMesh,
        tileMesh,
        tileInfo,
        tileMaterial
      );

      const endOfPrimaryRowTileMesh = segment.children.filter(
        (seg) => seg.name === "endOfPrimaryRowTileMesh"
      )[0] as InstancedMesh;

      expect(endOfPrimaryRowTileMesh.count).toBe(10);
    });
  });
});
