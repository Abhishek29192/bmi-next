import { BufferAttribute, BufferGeometry } from "three";

/*
 * Given a tile mesh (A three.js BufferGeometry object), this outputs a new geometry which has been
 * sliced at the given tile units line on the given axis.
 * Can also choose to keep the left side (less than the axis line) or the right side (greater than the axis line) of the mesh.
 * The other side of the mesh is discarded.
 *
 * The ultimate goal of this function is to produce tile pieces that fill gaps in the roof on the ends of rows of tiles.
 *
 * @param keepSide  either "left" or "right"
 * @param axis    either "x" or "z"
 */

export default (
  bufferGeometry: BufferGeometry,
  axisInTileUnits: number,
  axis: "x" | "z",
  keepSide: "left" | "right"
) => {
  // Get array of tri indices:
  const normals = bufferGeometry.getAttribute("normal");
  const uvs = bufferGeometry.getAttribute("uv");
  const verts = bufferGeometry.getAttribute("position").array;
  const tris = bufferGeometry.index?.array || [];

  const newTriangles = [];
  const newVerts: number[] = [];
  const newUvs: number[] = [];
  const newNormals: number[] = [];

  const rightIsKept = keepSide == "right";

  const axisOffset = axis == "x" ? 0 : 2; // y = 1. Y will never be used.
  const other2DAxisOffset = axis == "x" ? 2 : 0; // y = 1. The "other" axis when looking at the tile from the top down.
  let newVertIndex = verts.length / 3;

  const addIntersect = (vert1Index: number, vert2Index: number) => {
    const vert1IndexX3 = vert1Index * 3;
    const vert2IndexX3 = vert2Index * 3;

    const b = verts[vert1IndexX3 + axisOffset];
    const c = verts[vert2IndexX3 + axisOffset];
    const bOther = verts[vert1IndexX3 + other2DAxisOffset];
    const cOther = verts[vert2IndexX3 + other2DAxisOffset];
    const bY = verts[vert1IndexX3 + 1];
    const cY = verts[vert2IndexX3 + 1];

    // % of the slice line between 2 verts:
    const perc = (axisInTileUnits - b) / (c - b);
    const otherIntersect = bOther + perc * (cOther - bOther);
    const yIntersect = bY + perc * (cY - bY);

    // We now have the 3 coords of the intersection point
    // between this triangle edge and the slice line. Add it to newVerts:
    const newIndex = newVertIndex++;

    if (axisOffset == 0) {
      // a/b/c represent x values:
      newVerts.push(axisInTileUnits, yIntersect, otherIntersect);
    } else {
      // a/b/c represent z values:
      newVerts.push(otherIntersect, yIntersect, axisInTileUnits);
    }

    if (normals) {
      // TODO: calc correct normal at the intersect. It's always along the edge, so no need for barycentric stuff.
      // Just use normal of a for now:
      newNormals.push(
        // eslint-disable-next-line security/detect-object-injection
        normals.array[vert1IndexX3],
        normals.array[vert1IndexX3 + 1],
        normals.array[vert1IndexX3 + 2]
      );
    }

    if (uvs) {
      // TODO: calc correct uv at the intersect. It's always along the edge, so no need for barycentric stuff.
      const bU = uvs.array[vert1Index * 2];
      const cU = uvs.array[vert2Index * 2];
      const bV = uvs.array[vert1Index * 2 + 1];
      const cV = uvs.array[vert2Index * 2 + 1];

      newUvs.push(bU + perc * (cU - bU), bV + perc * (cV - bV));
    }

    return newIndex;
  };

  // +ve y is always assumed to be "up".
  // For each triangle, consider if it should be kept as-is, discarded, or sliced.
  for (let i = 0; i < tris.length; i += 3) {
    // eslint-disable-next-line security/detect-object-injection
    const aIndex = tris[i];
    const bIndex = tris[i + 1];
    const cIndex = tris[i + 2];

    const a = verts[aIndex * 3 + axisOffset];
    const b = verts[bIndex * 3 + axisOffset];
    const c = verts[cIndex * 3 + axisOffset];

    // First check if all 3 verts are on the same side of the line (they very commonly will be).
    // This means the tri is going to be either kept or discarded.

    const aOnLeft = a <= axisInTileUnits;
    const bOnLeft = b <= axisInTileUnits;
    const cOnLeft = c <= axisInTileUnits;

    if (aOnLeft && bOnLeft && cOnLeft) {
      // Entirely on the left.

      if (!rightIsKept) {
        // Add to out tri's as-is:
        newTriangles.push(aIndex, bIndex, cIndex);
      }
    } else if (!aOnLeft && !bOnLeft && !cOnLeft) {
      // Entirely on the right.

      if (rightIsKept) {
        // Add to out tri's as-is:
        newTriangles.push(aIndex, bIndex, cIndex);
      }
    } else {
      // The axis passes through this triangle - Slice it.

      // First we need the 2 intersection points (between axisInTileUnits and the lines of the triangle)
      // as we'll be using them regardless of what happens.

      // Of the 3 lines, find the 2 that intersect the line.

      // Check if a->b is the line that doesn't intersect
      if ((aOnLeft && bOnLeft) || (!aOnLeft && !bOnLeft)) {
        // b->c intersects
        // c->a intersects

        const bcIntersect = addIntersect(bIndex, cIndex);
        const caIntersect = addIntersect(cIndex, aIndex);

        // Ok, now which part are we keeping?

        if ((rightIsKept && aOnLeft) || (!aOnLeft && !rightIsKept)) {
          // the 2 verts of the source triangle are being discarded. 1 output tri only.
          newTriangles.push(bcIntersect, cIndex, caIntersect);
        } else {
          // generate 2 tris:
          newTriangles.push(
            aIndex,
            bIndex,
            bcIntersect,
            aIndex,
            bcIntersect,
            caIntersect
          );
        }

        // Check if b->c is the line that doesn't intersect
      } else if ((bOnLeft && cOnLeft) || (!bOnLeft && !cOnLeft)) {
        // c->a intersects
        // a->b intersects

        const caIntersect = addIntersect(cIndex, aIndex);
        const abIntersect = addIntersect(aIndex, bIndex);

        // Ok, now which part are we keeping?

        if ((rightIsKept && bOnLeft) || (!bOnLeft && !rightIsKept)) {
          // the 2 verts of the source triangle are being discarded. 1 output tri only.
          newTriangles.push(caIntersect, aIndex, abIntersect);
        } else {
          // generate 2 tris:
          newTriangles.push(
            bIndex,
            cIndex,
            caIntersect,
            bIndex,
            caIntersect,
            abIntersect
          );
        }
      } else {
        // must be c->a otherwise

        // a->b intersects
        // b->c intersects

        const abIntersect = addIntersect(aIndex, bIndex);
        const bcIntersect = addIntersect(bIndex, cIndex);

        // Ok, now which part are we keeping?

        if ((rightIsKept && cOnLeft) || (!cOnLeft && !rightIsKept)) {
          // the 2 verts of the source triangle are being discarded. 1 output tri only.
          newTriangles.push(abIntersect, bIndex, bcIntersect);
        } else {
          // generate 2 tris:
          newTriangles.push(
            cIndex,
            aIndex,
            abIntersect,
            cIndex,
            abIntersect,
            bcIntersect
          );
        }
      }
    }
  }

  // The new geometry
  const slicedTile = new BufferGeometry();

  // If we have new verts:
  if (newVerts.length) {
    // Merge originals and new ones:

    const totalVertCount = verts.length + newVerts.length;
    const vertBuffer = new Float32Array(totalVertCount);
    vertBuffer.set(verts);

    for (let i = 0; i < newVerts.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      vertBuffer[verts.length + i] = newVerts[i];
    }

    slicedTile.setAttribute("position", new BufferAttribute(vertBuffer, 3));

    if (normals) {
      const normalBuffer = new Float32Array(totalVertCount);
      normalBuffer.set(normals.array);

      for (let i = 0; i < newVerts.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        normalBuffer[verts.length + i] = newNormals[i];
      }

      slicedTile.setAttribute("normal", new BufferAttribute(normalBuffer, 3));
    }

    if (uvs) {
      const uvBuffer = new Float32Array(uvs.array.length + newUvs.length);
      uvBuffer.set(uvs.array);

      for (let i = 0; i < newUvs.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        uvBuffer[uvs.array.length + i] = newUvs[i];
      }

      slicedTile.setAttribute("uv", new BufferAttribute(uvBuffer, 2));
    }
  } else {
    for (const key in bufferGeometry.attributes) {
      // eslint-disable-next-line security/detect-object-injection
      slicedTile.setAttribute(key, bufferGeometry.attributes[key].clone());
    }
  }

  slicedTile.index = new BufferAttribute(new Uint16Array(newTriangles), 1);
  slicedTile.computeBoundingBox();
  return slicedTile;
};
