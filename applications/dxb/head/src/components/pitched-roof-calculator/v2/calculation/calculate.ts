import { Face, FaceWithBattens, Point, Vertex } from "../../types/roof";
import { Tile, VergeOption } from "../../types/v2";

const calculatePolygonArea = (vertices: Point[]) => {
  let area = 0;
  // Iterate through each edge on the shape, starting with the edge between n-1 and 0
  let j = vertices.length - 1;
  for (let i = 0; i < vertices.length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    area += (vertices[j].x + vertices[i].x) * (vertices[j].y - vertices[i].y);
    j = i;
  }
  return area / 2;
};

export const calculateArea = (faces: Face[]) => {
  let area = 0;
  // Calculate total roof area by considering each face individually first
  for (const face of faces) {
    area += calculatePolygonArea(face.vertices);
  }

  return area;
};

export const battenCalc = (vertices: Vertex[], mainTileVariant: Tile) => {
  const allBattens = [];
  // Get rafter length by taking highest y of all points
  const rafterLength = vertices.reduce(
    (prev, curr) => (prev < curr.y ? curr.y : prev),
    0
  );
  // Store list of battens. First batten should account for correct overhang, from height of tile and overhang.
  const firstBatten = mainTileVariant.eaveGauge;
  // Calculate the remaining space in the roof with the first batten position and ridge space
  const remainingSpace =
    rafterLength - firstBatten - mainTileVariant.ridgeSpacing;
  // Find the number of battens that are needed at max gauge by finding how many will fit at max gauge and round up by one
  const battenCount = Math.ceil(
    remainingSpace / mainTileVariant.maxBattenSpacing
  );

  // Find the adjusted even spacing and check that this is within min gauge
  const spacing = remainingSpace / battenCount;

  if (spacing < mainTileVariant.minBattenSpacing) {
    // eslint-disable-next-line no-console
    console.error("Tiles are at less than min gauge"); // Temporary alert until Error page is built.
  }

  // Place battens at this even spacing up to the top of the roof
  for (let i = 0; i < battenCount + 1; i += 1) {
    const battenHeight = firstBatten + i * spacing;
    const topOfTile = battenHeight;
    const bottomOfTile = Math.max(0, battenHeight - mainTileVariant.height);
    // Keep track of intersections with y = batten, and the edges of the shapes
    let intersections = [];
    // First consider edge between final point in list and first point
    let start = vertices.length - 1;
    // Loop through each edge
    for (let end = 0; end < vertices.length; end++) {
      // Check if edge has 0 gradient
      // eslint-disable-next-line security/detect-object-injection
      if (vertices[start].y !== vertices[end].y) {
        // Gradient is not equal to zero, check that the y = batten intersects the edge
        // eslint-disable-next-line security/detect-object-injection
        if (vertices[start].y >= topOfTile !== vertices[end].y >= topOfTile) {
          let bottomOfTileX = 0;
          let topOfTileX = 0;
          // If the edge is vertical then we know the x coordinate
          // eslint-disable-next-line security/detect-object-injection
          if (vertices[start].x === vertices[end].x) {
            // eslint-disable-next-line security/detect-object-injection
            bottomOfTileX = vertices[start].x;
            // eslint-disable-next-line security/detect-object-injection
            topOfTileX = vertices[start].x;
          } else {
            // Otherwise we need to find the x coordinate - using y - y1 = m(x - x1)
            const gradient =
              // eslint-disable-next-line security/detect-object-injection
              (vertices[end].y - vertices[start].y) /
              // eslint-disable-next-line security/detect-object-injection
              (vertices[end].x - vertices[start].x);
            bottomOfTileX =
              (bottomOfTile -
                // eslint-disable-next-line security/detect-object-injection
                vertices[start].y +
                // eslint-disable-next-line security/detect-object-injection
                gradient * vertices[start].x) /
              gradient;
            topOfTileX =
              // eslint-disable-next-line security/detect-object-injection
              (topOfTile - vertices[start].y + gradient * vertices[start].x) /
              gradient;
          }
          // Add intersection point to array
          intersections.push({
            bottomOfTileX,
            topOfTileX,
            // eslint-disable-next-line security/detect-object-injection
            side: vertices[start].side
          });
        }
        // eslint-disable-next-line security/detect-object-injection
      } else if (vertices[start].y === topOfTile) {
        // If the edge has 0 gradient and intersects batten then consider it's
        // intersection points as the x points we know
        intersections.push(
          // eslint-disable-next-line security/detect-object-injection
          { x: vertices[start].x, side: vertices[start].side },
          // eslint-disable-next-line security/detect-object-injection
          { x: vertices[end].x, side: vertices[start].side }
        );
      }
      // Move the start point to the end of this edge
      start = end;
    }
    // A batten should always intersect an even number of times
    if (intersections.length % 2 === 1) {
      throw new Error("Something has gone wrong, result may not be correct");
    }
    // Sort so that smallest x is at the start of the array
    intersections = intersections.sort(function (a, b) {
      return (
        Math.max(a.topOfTileX || 0, a.bottomOfTileX || 0) -
        Math.max(b.topOfTileX || 0, b.bottomOfTileX || 0)
      );
    });

    // Take each pair - indexes (0,1) (2,3) etc and calculate the distance between them.
    for (let pair = 0; pair < intersections.length; pair += 2) {
      // Find the width of this section which is covering the roof
      const width = Math.max(
        (intersections[pair + 1].topOfTileX || 0) -
          // eslint-disable-next-line security/detect-object-injection
          (intersections[pair].bottomOfTileX || 0),
        (intersections[pair + 1].topOfTileX || 0) -
          // eslint-disable-next-line security/detect-object-injection
          (intersections[pair].topOfTileX || 0),
        (intersections[pair + 1].bottomOfTileX || 0) -
          // eslint-disable-next-line security/detect-object-injection
          (intersections[pair].topOfTileX || 0),
        (intersections[pair + 1].bottomOfTileX || 0) -
          // eslint-disable-next-line security/detect-object-injection
          (intersections[pair].bottomOfTileX || 0)
      );
      // Set the batten width and side types
      allBattens.push({
        index: i,
        distanceFromEave: battenHeight,
        width: width,
        // eslint-disable-next-line security/detect-object-injection
        sides: [intersections[pair].side, intersections[pair + 1].side]
      });
    }
  }

  return allBattens;
};

export const surface = (
  { battens, sides, subtract }: FaceWithBattens,
  tile: Tile,
  hasHalfLeftVerges: boolean,
  hasHalfRightVerges: boolean,
  cloakedVerge?: VergeOption
) => {
  const { halfTile: half } = tile;
  const [left, right] = sides;
  // Count the number of main tiles and half tiles
  let count = 0;
  let halfCount = 0;
  let leftVergeCount = 0;
  let rightVergeCount = 0;
  let halfLeftVergeCount = 0;
  let halfRightVergeCount = 0;
  // Count tiles per each batten using tile covering width
  for (const batten of battens) {
    // If the product contains a half tile specification we round UP to the nearest half
    let row = Math.ceil(2 * (batten.width / tile.width));
    if (cloakedVerge && !subtract) {
      if (tile.brokenBond) {
        if (row % 2 === 0) {
          if (batten.index % 2 == 0) {
            if (left === "VERGE" && cloakedVerge.halfLeft) {
              halfLeftVergeCount++;
            } else if (!hasHalfLeftVerges) {
              halfCount++;
            }
            if (right === "VERGE" && cloakedVerge.halfRight) {
              halfRightVergeCount++;
            } else if (!hasHalfRightVerges) {
              halfCount++;
            }
            row -= 2;
          } else {
            if (left === "VERGE") {
              leftVergeCount++;
              row -= 2;
            }
            if (right === "VERGE") {
              rightVergeCount++;
              row -= 2;
            }
          }
        } else {
          if (batten.index % 2 == 0) {
            if (left === "VERGE") {
              leftVergeCount++;
            } else {
              count++;
            }
            if (right === "VERGE" && cloakedVerge.halfRight) {
              halfRightVergeCount++;
            } else if (!hasHalfRightVerges) {
              halfCount++;
            }
          } else {
            if (right === "VERGE") {
              rightVergeCount++;
            } else {
              count++;
            }
            if (left === "VERGE" && cloakedVerge.halfLeft) {
              halfLeftVergeCount++;
            } else if (!hasHalfLeftVerges) {
              halfCount++;
            }
          }
          row -= 3;
        }
      } else {
        if (left === "VERGE") {
          leftVergeCount++;
          row -= 2;
        }
        if (right === "VERGE") {
          rightVergeCount++;
          row -= 2;
        }
      }
    }
    if (half && !subtract) {
      if (row % 2 === 0) {
        // No decimal part - check if broken bond
        if (tile.brokenBond && !cloakedVerge && batten.index % 2 == 0) {
          // Replace one full width tile with two half tiles
          count += row / 2 - 1;
          halfCount += 2;
        } else {
          count += row / 2;
        }
      } else {
        // Half tile required - add integer part to tile count
        count += (row - 1) / 2;

        if (!hasHalfRightVerges && !hasHalfLeftVerges) {
          // Increment half tile count
          halfCount += 1;
        }
      }
    } else {
      if (subtract) {
        // When subtracting we round DOWN to avoid missing spaces
        count -= Math.floor(batten.width / tile.width);
      } else {
        // No half tile means round UP to the nearest tile
        count += Math.ceil(batten.width / tile.width);
      }
    }
  }
  const result = {
    quantity: count,
    half: {
      quantity: halfCount
    },
    cloakedVerge: {
      left: leftVergeCount,
      right: rightVergeCount,
      halfLeft: halfLeftVergeCount,
      halfRight: halfRightVergeCount
    }
  };
  return result;
};
