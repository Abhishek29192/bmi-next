import {
  Group,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D
} from "three";
import tileSlice from "./TileSlice";
import { PIMTile } from "./Types";

/*
 * Generates a planar, rectangular segment of roof between minX/ minZ and maxX/ maxZ using the given source tile (a ThreeJS Mesh object).
 *
 * Orientation of the tile does matter. This assumes that X values are horizontal, and Z values go "up the roof".
 *
 * @param boundsBox2   a ThreeJS Box2 defining the min/max bounds of the roof segment. Rotate the generated mesh into place.
 * @param tileInfo   Options which can be used to configure e.g. how much the tiles will overlap row-on-row.
 */

export default (
  seg: Mesh,
  tileMesh: Mesh,
  tileInfo: PIMTile,
  tileMaterial: MeshStandardMaterial
): Group | InstancedMesh | undefined => {
  // First measure the tile:
  const tileBounds = tileMesh.geometry.boundingBox;
  const roofBounds = seg.geometry.boundingBox;

  if (!tileBounds || !roofBounds) {
    return;
  }

  let tileWidth = tileBounds.max.x - tileBounds.min.x;
  const tileHeight = tileBounds.max.z - tileBounds.min.z;
  let tileThickness = tileBounds.max.y - tileBounds.min.y;
  const roofWidth = roofBounds.max.x - roofBounds.min.x;
  const roofHeight = roofBounds.max.z - roofBounds.min.z;

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
  const horizontalTilesExact = roofWidth / tileWidth;

  // The integer number of tiles that will fit on a row:
  const intHorizontalTiles = Math.floor(horizontalTilesExact);

  const rowWidthOfIntTiles = intHorizontalTiles * tileWidth;

  // Next, the number of tiles that fit vertically.
  // An option comes into play here - verticalOverlap, a 0 to <1 value representing how much the next row is pulled down as a proportion of tileHeight.
  let verticalOverlap = tileInfo.verticalOverlap || 0;

  if (verticalOverlap < 0) {
    verticalOverlap = 0;
  } else if (verticalOverlap >= 0.9) {
    // 1 would represent tiles being placed directly on top of each other, meaning no progression up the roof and a therefore infinite number of rows.
    // Therefore we cap it at a 90% overlap, meaning the absolute minimum a row can progress by is +10% of the tile height.
    verticalOverlap = 0.9;
  }

  const rowHeight = tileHeight - verticalOverlap * tileHeight;

  // Any overflow vertically will just hang off the bottom of the roof segment.
  let rowCount = Math.floor(roofHeight / rowHeight);

  if (((roofHeight % rowHeight) * 100) / rowHeight >= 75) {
    rowCount += 1;
  }

  // Tile instance count is therefore..
  const instanceCount = rowCount * intHorizontalTiles;

  // Create InstancedMesh:
  const primaryTilesMesh = new InstancedMesh(
    tileMesh.geometry.clone(),
    tileMaterial,
    instanceCount
  );

  primaryTilesMesh.name = "primaryTilesMesh";

  // Instance placement helper:
  const placementHelper = new Object3D();

  let instanceIndex = 0;
  let endOfRowIndex = 0;
  let endOfSecondaryRowIndex = 0;
  let startOfSecondaryRowIndex = 0;

  let rowZ =
    seg.rotation.x < 0
      ? roofBounds.max.z - rowHeight
      : roofBounds.min.z + rowHeight;

  const horizontalOffset = (tileInfo.horizontalOffset || 0) * tileWidth;

  // End of primary row sliced tile:
  const endOfRowTileWidth = roofWidth - rowWidthOfIntTiles;
  const endOfRowTile = tileSlice(
    tileMesh.geometry,
    tileBounds.max.x - endOfRowTileWidth,
    "x",
    "right"
  ); // Discard the left side
  const endOfPrimaryRowTileMesh = new InstancedMesh(
    endOfRowTile,
    tileMaterial,
    rowCount
  );
  endOfPrimaryRowTileMesh.name = "endOfPrimaryRowTileMesh";

  // Offset (secondary) row sliced tiles:
  let offsetRowWidth = rowWidthOfIntTiles + horizontalOffset;

  if (offsetRowWidth > roofWidth) {
    offsetRowWidth -= tileWidth;
  }

  let offsetRowEndTileWidth = 0;
  let endOfSecondaryRowTileMesh: InstancedMesh | undefined;
  let startOfSecondaryRowTileMesh: InstancedMesh | undefined;
  if (horizontalOffset != 0) {
    offsetRowEndTileWidth = roofWidth - offsetRowWidth;
    const endOfSecondaryRowTile = tileSlice(
      tileMesh.geometry,
      tileBounds.max.x - offsetRowEndTileWidth,
      "x",
      "right"
    ); // Discard the left side
    endOfSecondaryRowTileMesh = new InstancedMesh(
      endOfSecondaryRowTile,
      tileMaterial,
      rowCount
    );
    endOfSecondaryRowTileMesh.name = "endOfSecondaryRowTileMesh";

    const startOfSecondaryRowTile = tileSlice(
      tileMesh.geometry,
      tileBounds.min.x + horizontalOffset,
      "x",
      "left"
    ); // Discard the right side
    startOfSecondaryRowTileMesh = new InstancedMesh(
      startOfSecondaryRowTile,
      tileMaterial,
      rowCount
    );
    startOfSecondaryRowTileMesh.name = "startOfSecondaryRowTileMesh";
  }

  // Rotate the tiles such that they cleanly overlap (when an overlap is necessary).
  // Visualise how this rotation works by stacking 2 tiles on top of each other:

  //    [      ]
  //[     ]

  // Above, vertical = tileThickness and horizontal = tileHeight

  // This pair is then rotated such that both tile midpoints sit on the same horizontal line.
  // That results in the following rotation amount:
  let overlapRotation = verticalOverlap
    ? Math.atan2(tileThickness, (1 - verticalOverlap) * tileHeight * 2)
    : 0;

  if (seg.rotation.x > 0) {
    overlapRotation = overlapRotation * -1;
  }

  // For each row of tiles..
  for (let v = 0; v < rowCount; v++) {
    // This actually goes *down* the roof for 2 reasons - it greatly reduces overdraw
    // (that's because tiles higher up the roof overlap ones further down, and rendering the topmost object reduces wasted rendering of obscured tiles)
    // and it naturally makes any excess stick out from the bottom.

    // For each whole tile on the row..
    let thisRowOffset = 0;
    let tilesOnThisRow = intHorizontalTiles;
    // If odd row..
    if (v & 1) {
      // Offset it:
      thisRowOffset = horizontalOffset;

      // If the length of the offset row is beyond the max, reduce tiles on this row by 1:
      if (rowWidthOfIntTiles + horizontalOffset > roofWidth) {
        tilesOnThisRow--;
      }
    }

    let rowX = thisRowOffset - roofWidth / 2;
    const zRotation = tileInfo.invert ? Math.PI : 0;
    const yRotation = tileInfo.invertY ? 0 : Math.PI;

    for (let h = 0; h < tilesOnThisRow; h++) {
      // Add an instance.
      // They're offset by the bounds such that the min edge is exactly touching our target box.
      placementHelper.position.set(rowX - tileBounds.min.x, 0, rowZ);
      placementHelper.rotation.z = zRotation;
      placementHelper.rotation.y = yRotation;
      placementHelper.rotation.x = overlapRotation;
      placementHelper.updateMatrix();

      primaryTilesMesh.setMatrixAt(instanceIndex++, placementHelper.matrix);

      rowX += tileWidth;
    }

    // rowZ - tileBounds.min.z + tileWidth - offsetRowEndTileWidth

    placementHelper.position.set(rowX - tileBounds.min.x, 0, rowZ);
    placementHelper.rotation.z = zRotation;
    placementHelper.rotation.y = yRotation;
    placementHelper.rotation.x = overlapRotation;
    placementHelper.updateMatrix();

    if (v & 1 && horizontalOffset) {
      endOfSecondaryRowTileMesh?.setMatrixAt(
        endOfSecondaryRowIndex++,
        placementHelper.matrix
      );

      // Secondary row also has a tile at the start too:
      placementHelper.position.set((-1 * roofWidth) / 2, 0, rowZ);
      placementHelper.rotation.z = zRotation;
      placementHelper.rotation.y = yRotation;
      placementHelper.rotation.x = overlapRotation;
      placementHelper.updateMatrix();
      startOfSecondaryRowTileMesh?.setMatrixAt(
        startOfSecondaryRowIndex++,
        placementHelper.matrix
      );
    } else {
      endOfPrimaryRowTileMesh.setMatrixAt(
        endOfRowIndex++,
        placementHelper.matrix
      );
    }

    if (seg.rotation.x > 0) {
      rowZ += rowHeight;
    } else {
      rowZ -= rowHeight;
    }
  }

  primaryTilesMesh.castShadow = true;
  primaryTilesMesh.receiveShadow = true;
  primaryTilesMesh.instanceMatrix.needsUpdate = true;
  endOfPrimaryRowTileMesh.instanceMatrix.needsUpdate = true;

  endOfPrimaryRowTileMesh.castShadow = true;
  endOfPrimaryRowTileMesh.receiveShadow = true;

  const group = new Group();
  group.add(primaryTilesMesh);
  group.add(endOfPrimaryRowTileMesh);

  if (horizontalOffset) {
    if (endOfSecondaryRowTileMesh) {
      endOfSecondaryRowTileMesh.instanceMatrix.needsUpdate = true;
      group.add(endOfSecondaryRowTileMesh);
      endOfSecondaryRowTileMesh.castShadow = true;
      endOfSecondaryRowTileMesh.receiveShadow = true;
    }

    if (startOfSecondaryRowTileMesh) {
      startOfSecondaryRowTileMesh.instanceMatrix.needsUpdate = true;
      group.add(startOfSecondaryRowTileMesh);
      startOfSecondaryRowTileMesh.castShadow = true;
      startOfSecondaryRowTileMesh.receiveShadow = true;
    }
  }

  group.position.copy(seg.position);

  group.rotation.copy(seg.rotation);

  return group;
};
