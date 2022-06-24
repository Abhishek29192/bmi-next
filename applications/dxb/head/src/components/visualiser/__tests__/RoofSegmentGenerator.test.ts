import {
  Box3,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Vector3
} from "three";
import generateSegment from "../RoofSegmentGenerator";
import { Tile } from "../Types";

const roofMesh = new Mesh(
  new PlaneGeometry(10, 10),
  new MeshStandardMaterial()
);

roofMesh.position.set(0, 0, 0);
roofMesh.rotation.set(0.5, 0, 0);

const tileMesh = new Mesh(new PlaneGeometry(1, 1), new MeshStandardMaterial());

const tileInfo = { name: "Tile" } as Tile;
const tileMaterial = new MeshStandardMaterial();

describe("generateSegment", () => {
  describe("when mesh doesn't have boundingBox", () => {
    it("should return undefined", () => {
      roofMesh.geometry.boundingBox = null;
      const segment = generateSegment(
        roofMesh,
        tileMesh,
        tileInfo,
        tileMaterial
      );

      expect(segment).toBeUndefined();
    });
  });

  describe("when tile mesh doesn't have boundingBox", () => {
    it("should return undefined", () => {
      tileMesh.geometry.boundingBox = null;
      const segment = generateSegment(
        roofMesh,
        tileMesh,
        tileInfo,
        tileMaterial
      );

      expect(segment).toBeUndefined();
    });
  });

  describe("when roofMesh and tileMesh has boundingBox", () => {
    beforeAll(() => {
      roofMesh.geometry.boundingBox = new Box3(
        new Vector3(-5, -5, -5),
        new Vector3(5, 5, 5)
      );
      tileMesh.geometry.boundingBox = new Box3(
        new Vector3(0, 0, 0),
        new Vector3(1, 1, 1)
      );
    });

    it("should return roof segment", () => {
      const segment = generateSegment(
        roofMesh,
        tileMesh,
        tileInfo,
        tileMaterial
      );

      expect(segment).not.toBeUndefined();
    });

    it("roof segment should have same x,z coordinats as roofMesh", () => {
      const segment = generateSegment(
        roofMesh,
        tileMesh,
        tileInfo,
        tileMaterial
      );

      expect(segment.position.x).toBe(roofMesh.position.x);
      expect(segment.position.z).toBe(roofMesh.position.z);
    });

    it("roof segment should have y coordinate smaller by tileThickness size", () => {
      const segment = generateSegment(
        roofMesh,
        tileMesh,
        tileInfo,
        tileMaterial
      );

      expect(segment.position.y).toBe(-1.4);
    });

    it("roof segment should have same rootation as roofMesh", () => {
      const segment = generateSegment(
        roofMesh,
        tileMesh,
        tileInfo,
        tileMaterial
      );

      expect(segment.rotation.equals(roofMesh.rotation)).toBe(true);
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
});
