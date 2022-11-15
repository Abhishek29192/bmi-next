import { BufferAttribute, BufferGeometry } from "three";
import isEqual from "lodash-es/isEqual";
import sliceTile from "../TileSlice";

describe("Visualiser TileSlice", () => {
  let bufferGeometry;
  beforeEach(() => {
    bufferGeometry = new BufferGeometry();
    bufferGeometry.index = { array: new Uint16Array([]) };
    bufferGeometry.setAttribute(
      "position",
      new BufferAttribute(new Int8Array(), 0)
    );
  });

  it("returns correct value if bufferGeometry doesn't have index", () => {
    bufferGeometry.index = null;
    const slicedTile = sliceTile(bufferGeometry, 0, "x", "right");
    expect(slicedTile.index.array.length).toBe(0);
  });

  it("should not slice the tile", () => {
    bufferGeometry.index.array = new Uint16Array([1, 2, 3]);
    bufferGeometry.setAttribute(
      "position",
      new BufferAttribute(new Int8Array([3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), 10)
    );
    const slicedTile = sliceTile(bufferGeometry, 12, "x", "left");
    expect(
      isEqual(bufferGeometry.index.array, slicedTile.index.array)
    ).toBeTruthy();
  });

  describe("When a and b vertices are on the same side", () => {
    it("Slices the tile correctly if vertices are on the right side for X axis", () => {
      bufferGeometry.index.array = new Uint16Array([0, 1, 2]);
      bufferGeometry.setAttribute(
        "position",
        new BufferAttribute(new Int8Array([0, 1, 2, 3, 4, 5, 6]), 7)
      );
      const slicedTile = sliceTile(bufferGeometry, 4, "x", "right");
      expect(slicedTile.index.array).toEqual(new Uint16Array([2, 2, 3]));
    });

    it("Slices the tile correctly if vertices are on the right side for Z axis", () => {
      bufferGeometry.index.array = new Uint16Array([0, 1, 2]);
      bufferGeometry.setAttribute(
        "position",
        new BufferAttribute(new Int8Array([0, 1, 2, 3, 4, 5, 6]), 7)
      );
      const slicedTile = sliceTile(bufferGeometry, 6, "z", "right");
      expect(slicedTile.index.array).toEqual(new Uint16Array([2, 2, 3]));
    });

    it("Slices the tile correctly if vertices are on the left side for X axis", () => {
      bufferGeometry.index.array = new Uint16Array([3, 2, 1]);
      bufferGeometry.setAttribute(
        "position",
        new BufferAttribute(new Int8Array([0, 1, 2, 3, 4, 5, 6]), 7)
      );
      const slicedTile = sliceTile(bufferGeometry, 4, "x", "left");
      expect(slicedTile.index.array).toEqual(new Uint16Array([2, 1, 3]));
    });

    it("Slices the tile correctly if vertices are on the left side for Z axis", () => {
      bufferGeometry.index.array = new Uint16Array([3, 2, 1]);
      bufferGeometry.setAttribute(
        "position",
        new BufferAttribute(new Int8Array([0, 1, 2, 3, 4, 5, 6]), 7)
      );
      const slicedTile = sliceTile(bufferGeometry, 8, "z", "left");
      expect(slicedTile.index.array).toEqual(new Uint16Array([2, 1, 3]));
    });

    it("Generates 6 vertices", () => {
      bufferGeometry.index.array = new Uint16Array([3, 2, 1]);
      bufferGeometry.setAttribute(
        "position",
        new BufferAttribute(new Int8Array([0, 1, 2, 3, 4, 5, 6]), 7)
      );
      const slicedTile = sliceTile(bufferGeometry, 4, "x", "right");
      expect(slicedTile.index.array).toEqual(
        new Uint16Array([3, 2, 2, 3, 2, 3])
      );
    });

    it("slice tile correctly when bufferGeometry has normals", () => {
      bufferGeometry.index.array = new Uint16Array([0, 1, 2]);
      bufferGeometry.setAttribute(
        "position",
        new BufferAttribute(new Int8Array([0, 1, 2, 3, 4, 5, 6]), 7)
      );
      bufferGeometry.setAttribute(
        "normal",
        new BufferAttribute(new Int8Array([1, 2, 3, 4, 5, 6]), 6)
      );
      const slicedTile = sliceTile(bufferGeometry, 4, "x", "right");
      expect(
        slicedTile.attributes.normal.array.length >
          bufferGeometry.attributes.normal.array.length
      ).toBeTruthy();
    });

    it("slice tile correctly when bufferGeometry has uv", () => {
      bufferGeometry.index.array = new Uint16Array([0, 1, 2]);
      bufferGeometry.setAttribute(
        "position",
        new BufferAttribute(new Int8Array([0, 1, 2, 3, 4, 5, 6]), 7)
      );
      bufferGeometry.setAttribute(
        "uv",
        new BufferAttribute(new Int8Array([1, 2, 3, 4, 5, 6]), 6)
      );
      const slicedTile = sliceTile(bufferGeometry, 4, "x", "right");
      expect(
        slicedTile.attributes.uv.array.length >
          bufferGeometry.attributes.uv.array.length
      ).toBeTruthy();
    });
  });

  describe("When b and c vertices are on the same side", () => {
    it("Slices the tile correctly if vertices are on the right side for X axis", () => {
      bufferGeometry.index.array = new Uint16Array([3, 1, 2]);
      bufferGeometry.setAttribute(
        "position",
        new BufferAttribute(new Int8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 10)
      );
      const slicedTile = sliceTile(bufferGeometry, 8, "x", "right");
      expect(slicedTile.index.array).toEqual(new Uint16Array([3, 3, 4]));
    });

    it("Slices the tile correctly if vertices are on the left side for X axis", () => {
      bufferGeometry.index.array = new Uint16Array([1, 3, 3]);
      bufferGeometry.setAttribute(
        "position",
        new BufferAttribute(new Int8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 10)
      );
      const slicedTile = sliceTile(bufferGeometry, 4, "x", "left");
      expect(slicedTile.index.array).toEqual(new Uint16Array([3, 1, 4]));
    });

    it("Generates 6 vertices", () => {
      bufferGeometry.index.array = new Uint16Array([3, 2, 1]);
      bufferGeometry.setAttribute(
        "position",
        new BufferAttribute(new Int8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 10)
      );
      const slicedTile = sliceTile(bufferGeometry, 8, "x", "left");
      expect(slicedTile.index.array).toEqual(
        new Uint16Array([2, 1, 3, 2, 3, 4])
      );
    });
  });

  describe("When a and c vertices are on the same side", () => {
    it("Slices the tile correctly if vertices are on the right side", () => {
      bufferGeometry.index.array = new Uint16Array([1, 3, 2]);
      bufferGeometry.setAttribute(
        "position",
        new BufferAttribute(new Int8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 10)
      );
      const slicedTile = sliceTile(bufferGeometry, 7, "x", "right");
      expect(slicedTile.index.array).toEqual(new Uint16Array([3, 3, 4]));
    });

    it("Slices the tile correctly if vertices are on the left side", () => {
      bufferGeometry.index.array = new Uint16Array([6, 1, 4]);
      bufferGeometry.setAttribute(
        "position",
        new BufferAttribute(new Int8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 10)
      );
      const slicedTile = sliceTile(bufferGeometry, 7, "x", "left");
      expect(slicedTile.index.array).toEqual(new Uint16Array([3, 1, 4]));
    });

    it("Generates 6 vertices", () => {
      bufferGeometry.index.array = new Uint16Array([5, 1, 4]);
      bufferGeometry.setAttribute(
        "position",
        new BufferAttribute(new Int8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 10)
      );
      const slicedTile = sliceTile(bufferGeometry, 7, "x", "right");
      expect(slicedTile.index.array).toEqual(
        new Uint16Array([4, 5, 3, 4, 3, 4])
      );
    });
  });
});
