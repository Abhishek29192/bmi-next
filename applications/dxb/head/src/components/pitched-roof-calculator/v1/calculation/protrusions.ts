import Protrusion01 from "../../images/protrusions/protrusion01.svg";
import Protrusion01Dim from "../../images/protrusions/protrusion01-dims.svg";
import Protrusion02 from "../../images/protrusions/protrusion02.svg";
import Protrusion02Dim from "../../images/protrusions/protrusion02-dims.svg";
import Protrusion03 from "../../images/protrusions/protrusion03.svg";
import Protrusion03Dim from "../../images/protrusions/protrusion03-dims.svg";
import { Protrusion, DimensionsValues } from "../../types/roof";
import getMeasurement from "./getMeasurement";

const protrusion01: Protrusion = {
  illustration: Protrusion01,
  dimensionsIllustration: Protrusion01Dim,
  fields: [
    { name: "A", type: "PROTRUSION_LENGTH" },
    { name: "B", type: "PROTRUSION_LENGTH" },
    { name: "P", type: "PITCH" }
  ],
  getMeasurements: (values: DimensionsValues) => {
    const A = getMeasurement(values, "A") * 100;
    const B = getMeasurement(values, "B") * 100;
    const P = getMeasurement(values, "P");
    const roofPitch = getMeasurement(values, "roofPitch");

    const height = A / Math.cos((P * Math.PI) / 180);

    return {
      faces: [
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: 0,
              y: height
            },
            { x: B, y: height },
            { x: B, y: 0 }
          ],
          pitch: P,
          sides: ["VERGE", "VERGE"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: 0,
              y: A
            },
            { x: B, y: A },
            { x: B, y: 0 }
          ],
          pitch: roofPitch,
          sides: ["VALLEY", "VALLEY"],
          subtract: true
        }
      ],
      lines: {
        hip: [],
        ridge: [],
        eave: [{ length: B }],
        leftVerge: [{ length: height }],
        rightVerge: [{ length: height }],
        valley: [
          { length: A, end: true },
          { length: A, end: true }
        ]
      }
    };
  }
};

const protrusion02: Protrusion = {
  illustration: Protrusion02,
  dimensionsIllustration: Protrusion02Dim,
  fields: [
    { name: "A", type: "PROTRUSION_LENGTH" },
    { name: "B", type: "PROTRUSION_LENGTH" },
    { name: "P", type: "PITCH" }
  ],
  getMeasurements: (values: DimensionsValues) => {
    const A = getMeasurement(values, "A") * 100;
    const B = getMeasurement(values, "B") * 100;
    const P = getMeasurement(values, "P");
    const roofPitch = getMeasurement(values, "roofPitch");

    const protrusionHeight = (A / 2) * Math.tan((P * Math.PI) / 180);
    const protrusionRafter = protrusionHeight / Math.sin((P * Math.PI) / 180);
    const protrusionDepth =
      protrusionHeight / Math.tan((roofPitch * Math.PI) / 180);

    const protrusionValley = Math.sqrt(
      protrusionDepth ** 2 + protrusionRafter ** 2
    );

    return {
      faces: [
        {
          vertices: [
            { x: protrusionDepth, y: 0 },
            {
              x: 0,
              y: protrusionRafter
            },
            { x: B, y: protrusionRafter },
            { x: B, y: 0 }
          ],
          pitch: P,
          sides: ["VALLEY", "VERGE"]
        },
        {
          vertices: [
            { x: protrusionDepth, y: 0 },
            {
              x: 0,
              y: protrusionRafter
            },
            { x: B, y: protrusionRafter },
            { x: B, y: 0 }
          ],
          pitch: P,
          sides: ["VERGE", "VALLEY"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: A / 2,
              y: protrusionHeight
            },
            { x: A, y: 0 }
          ],
          pitch: roofPitch,
          sides: ["VALLEY", "VALLEY"], // Just a fill-in option, TBC whether we need to add these tiles
          subtract: true
        }
      ],
      lines: {
        hip: [],
        ridge: [{ length: B }],
        eave: [
          { length: B - protrusionDepth },
          { length: B - protrusionDepth }
        ],
        leftVerge: [{ length: protrusionRafter }],
        rightVerge: [{ length: protrusionRafter }],
        valley: [
          { length: protrusionValley, dormerStart: true, end: true },
          { length: protrusionValley, dormerStart: true, end: true }
        ]
      }
    };
  }
};

const protrusion03: Protrusion = {
  illustration: Protrusion03,
  dimensionsIllustration: Protrusion03Dim,
  fields: [
    { name: "A", type: "PROTRUSION_LENGTH" },
    { name: "P", type: "PITCH" }
  ],
  getMeasurements: (values: DimensionsValues) => {
    const A = getMeasurement(values, "A") * 100;
    const P = getMeasurement(values, "P");
    const roofPitch = getMeasurement(values, "roofPitch");

    const protrusionHeight = (A / 2) * Math.tan((P * Math.PI) / 180);
    const protrusionRafter = protrusionHeight / Math.sin((P * Math.PI) / 180);
    const protrusionDepth =
      protrusionHeight / Math.tan((roofPitch * Math.PI) / 180);

    const protrusionValley = Math.sqrt(
      protrusionDepth ** 2 + protrusionRafter ** 2
    );

    return {
      faces: [
        {
          vertices: [
            { x: protrusionDepth, y: 0 },
            {
              x: 0,
              y: protrusionRafter
            },
            { x: protrusionDepth, y: protrusionRafter }
          ],
          pitch: P,
          sides: ["VALLEY", "VERGE"]
        },
        {
          vertices: [
            { x: protrusionDepth, y: 0 },
            {
              x: 0,
              y: protrusionRafter
            },
            { x: protrusionDepth, y: protrusionRafter }
          ],
          pitch: P,
          sides: ["VERGE", "VALLEY"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: A / 2,
              y: protrusionHeight
            },
            { x: A, y: 0 }
          ],
          pitch: roofPitch,
          sides: ["VALLEY", "VALLEY"], // Just a fill-in option, TBC whether we need to add these tiles
          subtract: true
        }
      ],
      lines: {
        hip: [],
        ridge: [{ length: protrusionDepth }],
        eave: [],
        leftVerge: [{ length: protrusionRafter }],
        rightVerge: [{ length: protrusionRafter }],
        valley: [
          { length: protrusionValley, start: true },
          { length: protrusionValley, start: true }
        ]
      }
    };
  }
};

export default {
  protrusion01,
  protrusion02,
  protrusion03
} as { [key: string]: Protrusion };
