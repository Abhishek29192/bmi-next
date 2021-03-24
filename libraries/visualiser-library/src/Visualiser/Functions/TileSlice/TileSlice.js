// TODO: resolve eslint issues:
import * as THREE from "../ThreeJs/ThreeJs.js";

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

export default (bufferGeometry, axisInTileUnits, axis, keepSide) => {
  // Get array of tri indices:
  var normals = bufferGeometry.getAttribute("normal");
  var uvs = bufferGeometry.getAttribute("uv");
  var verts = bufferGeometry.getAttribute("position").array;
  var tris = bufferGeometry.index.array;

  var newTriangles = [];
  var newVerts = [];
  var newUvs = [];
  var newNormals = [];

  var rightIsKept = keepSide == "right";

  var axisOffset = axis == "x" ? 0 : 2; // y = 1. Y will never be used.
  var other2DAxisOffset = axis == "x" ? 2 : 0; // y = 1. The "other" axis when looking at the tile from the top down.
  var newVertIndex = verts.length / 3;

  var addIntersect = (vert1Index, vert2Index) => {
    var vert1IndexX3 = vert1Index * 3;
    var vert2IndexX3 = vert2Index * 3;

    var b = verts[vert1IndexX3 + axisOffset];
    var c = verts[vert2IndexX3 + axisOffset];
    var bOther = verts[vert1IndexX3 + other2DAxisOffset];
    var cOther = verts[vert2IndexX3 + other2DAxisOffset];
    var bY = verts[vert1IndexX3 + 1];
    var cY = verts[vert2IndexX3 + 1];

    // % of the slice line between 2 verts:
    var perc = (axisInTileUnits - b) / (c - b);
    var otherIntersect = bOther + perc * (cOther - bOther);
    var yIntersect = bY + perc * (cY - bY);

    // We now have the 3 coords of the intersection point
    // between this triangle edge and the slice line. Add it to newVerts:
    var newIndex = newVertIndex++;

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
        normals.array[vert1IndexX3],
        normals.array[vert1IndexX3 + 1],
        normals.array[vert1IndexX3 + 2]
      );
    }

    if (uvs) {
      // TODO: calc correct uv at the intersect. It's always along the edge, so no need for barycentric stuff.
      var bU = uvs.array[vert1Index * 2];
      var cU = uvs.array[vert2Index * 2];
      var bV = uvs.array[vert1Index * 2 + 1];
      var cV = uvs.array[vert2Index * 2 + 1];

      newUvs.push(bU + perc * (cU - bU), bV + perc * (cV - bV));
    }

    return newIndex;
  };

  // +ve y is always assumed to be "up".
  // For each triangle, consider if it should be kept as-is, discarded, or sliced.
  for (var i = 0; i < tris.length; i += 3) {
    var aIndex = tris[i];
    var bIndex = tris[i + 1];
    var cIndex = tris[i + 2];

    var a = verts[aIndex * 3 + axisOffset];
    var b = verts[bIndex * 3 + axisOffset];
    var c = verts[cIndex * 3 + axisOffset];

    // First check if all 3 verts are on the same side of the line (they very commonly will be).
    // This means the tri is going to be either kept or discarded.

    var aOnLeft = a <= axisInTileUnits;
    var bOnLeft = b <= axisInTileUnits;
    var cOnLeft = c <= axisInTileUnits;

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

        var bcIntersect = addIntersect(bIndex, cIndex);
        var caIntersect = addIntersect(cIndex, aIndex);

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

        var caIntersect = addIntersect(cIndex, aIndex);
        var abIntersect = addIntersect(aIndex, bIndex);

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

        var abIntersect = addIntersect(aIndex, bIndex);
        var bcIntersect = addIntersect(bIndex, cIndex);

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
  const slicedTile = new THREE.BufferGeometry();

  // If we have new verts:
  if (newVerts.length) {
    // Merge originals and new ones:

    var totalVertCount = verts.length + newVerts.length;
    var vertBuffer = new Float32Array(totalVertCount);
    vertBuffer.set(verts);

    for (var i = 0; i < newVerts.length; i++) {
      vertBuffer[verts.length + i] = newVerts[i];
    }

    slicedTile.setAttribute(
      "position",
      new THREE.BufferAttribute(vertBuffer, 3)
    );

    if (normals) {
      var normalBuffer = new Float32Array(totalVertCount);
      normalBuffer.set(normals.array);

      for (var i = 0; i < newVerts.length; i++) {
        normalBuffer[verts.length + i] = newNormals[i];
      }

      slicedTile.setAttribute(
        "normal",
        new THREE.BufferAttribute(normalBuffer, 3)
      );
    }

    if (uvs) {
      var uvBuffer = new Float32Array(uvs.array.length + newUvs.length);
      uvBuffer.set(uvs.array);

      for (var i = 0; i < newUvs.length; i++) {
        uvBuffer[uvs.array.length + i] = newUvs[i];
      }

      slicedTile.setAttribute("uv", new THREE.BufferAttribute(uvBuffer, 2));
    }
  } else {
    for (var key in bufferGeometry.attributes) {
      slicedTile.setAttribute(key, bufferGeometry.attributes[key].clone());
    }
  }

  slicedTile.index = new THREE.BufferAttribute(
    new Uint16Array(newTriangles),
    1
  );
  slicedTile.computeBoundingBox();
  return slicedTile;
};
