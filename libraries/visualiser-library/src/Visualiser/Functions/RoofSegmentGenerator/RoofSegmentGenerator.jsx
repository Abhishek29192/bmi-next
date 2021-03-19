// TODO: resolve eslint issues:
/* eslint-disable */
import * as THREE from "../ThreeJs/ThreeJs.js";
import tileSlice from "../TileSlice/TileSlice.js";

/*
 * Generates a planar, rectangular segment of roof between minX/ minZ and maxX/ maxZ using the given source tile (a ThreeJS Mesh object).
 *
 * Orientation of the tile does matter. This assumes that X values are horizontal, and Z values go "up the roof".
 *
 * @param boundsBox2   a ThreeJS Box2 defining the min/max bounds of the roof segment. Rotate the generated mesh into place.
 * @param tileInfo   Options which can be used to configure e.g. how much the tiles will overlap row-on-row.
 */

export default (boundsBox2, tileMesh, tileInfo, tileMaterial) => {
  tileInfo = tileInfo || {};

  // First measure the tile:
  var tileBounds = tileMesh.geometry.boundingBox;

  var tileWidth = tileBounds.max.x - tileBounds.min.x;
  var tileHeight = tileBounds.max.z - tileBounds.min.z;
  var tileThickness = tileBounds.max.y - tileBounds.min.y;
  var roofWidth = boundsBox2.max.x - boundsBox2.min.x;
  var roofHeight = boundsBox2.max.y - boundsBox2.min.y;

  // Reduce apparent tile thickness:
  tileInfo.thicknessReduction = tileInfo.thicknessReduction || 0.3;
  if (tileInfo.thicknessReduction) {
    tileThickness -= tileInfo.thicknessReduction * tileThickness;
  }

  // Reduce apparent tile width:
  if (tileInfo.horizontalOverlap) {
    tileWidth -= tileInfo.horizontalOverlap * tileWidth;
  }

  // Calculate how many tiles fit horizontally:
  var horizontalTilesExact = roofWidth / tileWidth;

  // The integer number of tiles that will fit on a row:
  var intHorizontalTiles = Math.floor(horizontalTilesExact);

  var rowWidthOfIntTiles = intHorizontalTiles * tileWidth;

  // Next, the number of tiles that fit vertically.
  // An option comes into play here - verticalOverlap, a 0 to <1 value representing how much the next row is pulled down as a proportion of tileHeight.
  var verticalOverlap = tileInfo.verticalOverlap || 0;

  if (verticalOverlap < 0) {
    verticalOverlap = 0;
  } else if (verticalOverlap >= 0.9) {
    // 1 would represent tiles being placed directly on top of each other, meaning no progression up the roof and a therefore infinite number of rows.
    // Therefore we cap it at a 90% overlap, meaning the absolute minimum a row can progress by is +10% of the tile height.
    verticalOverlap = 0.9;
  }

  var rowHeight = tileHeight - verticalOverlap * tileHeight;

  // Any overflow vertically will just hang off the bottom of the roof segment.
  var rowCount = Math.ceil(roofHeight / rowHeight);

  // Tile instance count is therefore..
  var instanceCount = rowCount * intHorizontalTiles;

  // Create InstancedMesh:
  var primaryTilesMesh = new THREE.InstancedMesh(
    tileMesh.geometry.clone(),
    tileMaterial,
    instanceCount
  );

  // Instance placement helper:
  var placementHelper = new THREE.Object3D();

  var instanceIndex = 0;
  var endOfRowIndex = 0;
  var endOfSecondaryRowIndex = 0;
  var startOfSecondaryRowIndex = 0;

  var rowZ = boundsBox2.max.y;

  var horizontalOffset = (tileInfo.horizontalOffset || 0) * tileWidth;

  // End of primary row sliced tile:
  var endOfRowTileWidth = roofWidth - rowWidthOfIntTiles;
  var endOfRowTile = tileSlice(
    tileMesh.geometry,
    tileMesh.geometry.boundingBox.max.x - endOfRowTileWidth,
    "x",
    "right"
  ); // Discard the left side
  var endOfPrimaryRowTileMesh = new THREE.InstancedMesh(
    endOfRowTile,
    tileMaterial,
    rowCount
  );

  // Offset (secondary) row sliced tiles:
  var offsetRowWidth = rowWidthOfIntTiles + horizontalOffset;

  if (offsetRowWidth > roofWidth) {
    offsetRowWidth -= tileWidth;
  }

  if (horizontalOffset != 0) {
    var offsetRowEndTileWidth = roofWidth - offsetRowWidth;
    var endOfSecondaryRowTile = tileSlice(
      tileMesh.geometry,
      tileMesh.geometry.boundingBox.max.x - offsetRowEndTileWidth,
      "x",
      "right"
    ); // Discard the left side
    var endOfSecondaryRowTileMesh = new THREE.InstancedMesh(
      endOfSecondaryRowTile,
      tileMaterial,
      rowCount
    );

    var startOfSecondaryRowTile = tileSlice(
      tileMesh.geometry,
      tileMesh.geometry.boundingBox.min.x + horizontalOffset,
      "x",
      "left"
    ); // Discard the right side
    var startOfSecondaryRowTileMesh = new THREE.InstancedMesh(
      startOfSecondaryRowTile,
      tileMaterial,
      rowCount
    );
  }

  // Rotate the tiles such that they cleanly overlap (when an overlap is necessary).
  // Visualise how this rotation works by stacking 2 tiles on top of each other:

  //    [      ]
  //[     ]

  // Above, vertical = tileThickness and horizontal = tileHeight

  // This pair is then rotated such that both tile midpoints sit on the same horizontal line.
  // That results in the following rotation amount:
  var overlapRotation = verticalOverlap
    ? Math.atan2(tileThickness, (1 - verticalOverlap) * tileHeight)
    : 0;

  // For each row of tiles..
  for (var v = 0; v < rowCount; v++) {
    // This actually goes *down* the roof for 2 reasons - it greatly reduces overdraw
    // (that's because tiles higher up the roof overlap ones further down, and rendering the topmost object reduces wasted rendering of obscured tiles)
    // and it naturally makes any excess stick out from the bottom.

    // For each whole tile on the row..
    var thisRowOffset = 0;
    var tilesOnThisRow = intHorizontalTiles;

    // If odd row..
    if (v & 1) {
      // Offset it:
      thisRowOffset = horizontalOffset;

      // If the length of the offset row is beyond the max, reduce tiles on this row by 1:
      if (rowWidthOfIntTiles + horizontalOffset > roofWidth) {
        tilesOnThisRow--;
      }
    }

    var rowX = boundsBox2.min.x + thisRowOffset;
    var zRotation = tileInfo.invert ? Math.PI : 0;
    var yRotation = tileInfo.invertY ? 0 : Math.PI;

    for (var h = 0; h < tilesOnThisRow; h++) {
      // Add an instance.
      // They're offset by the bounds such that the min edge is exactly touching our target box.
      placementHelper.position.set(
        rowX - tileBounds.min.x,
        0,
        rowZ - tileBounds.min.z
      );
      placementHelper.rotation.z = zRotation;
      placementHelper.rotation.y = yRotation;
      placementHelper.rotation.x = overlapRotation;
      placementHelper.updateMatrix();

      primaryTilesMesh.setMatrixAt(instanceIndex++, placementHelper.matrix);

      rowX += tileWidth;
    }

    // Add the sliced tile at the end of the row:
    var amountSlicedOff =
      v & 1 && horizontalOffset
        ? tileWidth - offsetRowEndTileWidth
        : tileWidth - endOfRowTileWidth;

    // rowZ - tileBounds.min.z + tileWidth - offsetRowEndTileWidth

    placementHelper.position.set(
      rowX - tileBounds.min.x,
      0,
      rowZ - tileBounds.min.z
    );
    placementHelper.rotation.z = zRotation;
    placementHelper.rotation.y = yRotation;
    placementHelper.rotation.x = overlapRotation;
    placementHelper.updateMatrix();

    if (v & 1 && horizontalOffset) {
      endOfSecondaryRowTileMesh.setMatrixAt(
        endOfSecondaryRowIndex++,
        placementHelper.matrix
      );

      // Secondary row also has a tile at the start too:
      placementHelper.position.set(
        boundsBox2.min.x,
        0,
        rowZ - tileBounds.min.z
      );
      placementHelper.rotation.z = zRotation;
      placementHelper.rotation.y = yRotation;
      placementHelper.rotation.x = overlapRotation;
      placementHelper.updateMatrix();
      startOfSecondaryRowTileMesh.setMatrixAt(
        startOfSecondaryRowIndex++,
        placementHelper.matrix
      );
    } else {
      endOfPrimaryRowTileMesh.setMatrixAt(
        endOfRowIndex++,
        placementHelper.matrix
      );
    }

    rowZ -= rowHeight;
  }

  primaryTilesMesh.castShadow = true;
  primaryTilesMesh.receiveShadow = true;
  primaryTilesMesh.instanceMatrix.needsUpdate = true;
  endOfPrimaryRowTileMesh.instanceMatrix.needsUpdate = true;

  endOfPrimaryRowTileMesh.castShadow = true;
  endOfPrimaryRowTileMesh.receiveShadow = true;

  var group = new THREE.Group();
  group.add(primaryTilesMesh);
  group.add(endOfPrimaryRowTileMesh);

  if (horizontalOffset) {
    endOfSecondaryRowTileMesh.instanceMatrix.needsUpdate = true;
    startOfSecondaryRowTileMesh.instanceMatrix.needsUpdate = true;
    group.add(endOfSecondaryRowTileMesh);
    group.add(startOfSecondaryRowTileMesh);

    endOfSecondaryRowTileMesh.castShadow = true;
    endOfSecondaryRowTileMesh.receiveShadow = true;

    startOfSecondaryRowTileMesh.castShadow = true;
    startOfSecondaryRowTileMesh.receiveShadow = true;
  }

  return group;
};
