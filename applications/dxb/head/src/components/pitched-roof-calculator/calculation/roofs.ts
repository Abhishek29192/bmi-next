import Roof1Illustration from "../images/roof-shapes/roof1.svg";
import Roof1DimensionsIllustration from "../images/roof-dimensions/roof1.svg";
import Roof2Illustration from "../images/roof-shapes/roof2.svg";
import Roof2DimensionsIllustration from "../images/roof-dimensions/roof2.svg";
import Roof3Illustration from "../images/roof-shapes/roof3.svg";
import Roof3DimensionsIllustration from "../images/roof-dimensions/roof3.svg";
import Roof4Illustration from "../images/roof-shapes/roof4.svg";
import Roof4DimensionsIllustration from "../images/roof-dimensions/roof4.svg";
import Roof5Illustration from "../images/roof-shapes/roof5.svg";
import Roof5DimensionsIllustration from "../images/roof-dimensions/roof5.svg";
import Roof6Illustration from "../images/roof-shapes/roof6.svg";
import Roof6DimensionsIllustration from "../images/roof-dimensions/roof6.svg";
import Roof7Illustration from "../images/roof-shapes/roof7.svg";
import Roof7DimensionsIllustration from "../images/roof-dimensions/roof7.svg";
import Roof8Illustration from "../images/roof-shapes/roof8.svg";
import Roof8DimensionsIllustration from "../images/roof-dimensions/roof8.svg";
import Roof9Illustration from "../images/roof-shapes/roof9.svg";
import Roof9DimensionsIllustration from "../images/roof-dimensions/roof9.svg";
import Roof10Illustration from "../images/roof-shapes/roof10.svg";
import Roof10DimensionsIllustration from "../images/roof-dimensions/roof10.svg";
import { DimensionsValues, Roof } from "../types/roof";
import getMeasurement from "./getMeasurement";

const roof1: Roof = {
  name: "1",
  type: "gable",
  illustration: Roof1Illustration,
  dimensionsIllustration: Roof1DimensionsIllustration,
  roofPitchField: "P",
  fields: [
    {
      name: "A",
      type: "LENGTH"
    },
    {
      name: "B",
      type: "LENGTH"
    },
    {
      name: "P",
      type: "PITCH"
    }
  ],
  getMeasurements: (values: DimensionsValues) => {
    const A = getMeasurement(values, "A") * 100;
    const B = getMeasurement(values, "B") * 100;
    const P = getMeasurement(values, "P");
    const rafterLength = A / (2 * Math.cos((P * Math.PI) / 180));
    return {
      faces: [
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: rafterLength
            },
            {
              x: B,
              y: rafterLength
            },
            { x: B, y: 0 }
          ],
          pitch: P,
          sides: ["VERGE", "VERGE"]
        },
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: rafterLength
            },
            {
              x: B,
              y: rafterLength
            },
            { x: B, y: 0 }
          ],
          pitch: P,
          sides: ["VERGE", "VERGE"]
        }
      ],
      lines: {
        hip: [],
        ridge: [{ length: B }],
        eave: [{ length: A }, { length: A }, { length: B }, { length: B }],
        leftVerge: [{ length: rafterLength }, { length: rafterLength }],
        rightVerge: [{ length: rafterLength }, { length: rafterLength }],
        valley: []
      }
    };
  }
};

const roof2: Roof = {
  name: "2",
  type: "gable",
  illustration: Roof2Illustration,
  dimensionsIllustration: Roof2DimensionsIllustration,
  roofPitchField: "P1",
  fields: [
    {
      name: "A",
      type: "LENGTH"
    },
    {
      name: "B",
      type: "PROTRUSION_LENGTH"
    },
    {
      name: "C",
      type: "LENGTH"
    },
    {
      name: "D",
      type: "PROTRUSION_LENGTH"
    },
    {
      name: "E",
      type: "LENGTH"
    },
    {
      name: "P1",
      type: "PITCH"
    },
    {
      name: "P2",
      type: "PITCH"
    }
  ],
  getMeasurements: (values: DimensionsValues) => {
    const A = getMeasurement(values, "A") * 100;
    const B = getMeasurement(values, "B") * 100;
    const C = getMeasurement(values, "C") * 100;
    const D = getMeasurement(values, "D") * 100;
    const E = getMeasurement(values, "E") * 100;
    const width = C + D + E;
    const P1 = getMeasurement(values, "P1");
    const P2 = getMeasurement(values, "P2");

    const rafterLength = A / (2 * Math.cos((P1 * Math.PI) / 180));

    const protrusionRafterLength = D / (2 * Math.cos((P2 * Math.PI) / 180));
    const protrusionHeight = (D * Math.tan((P2 * Math.PI) / 180)) / 2;
    const cutInDepth = protrusionHeight / Math.tan((P1 * Math.PI) / 180);
    const cutInLength = Math.sqrt(
      cutInDepth ** 2 + protrusionRafterLength ** 2
    );

    return {
      faces: [
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: rafterLength
            },
            {
              x: width,
              y: rafterLength
            },
            { x: width, y: 0 }
          ],
          pitch: P1,
          sides: ["VERGE", "VERGE"]
        },
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: rafterLength
            },
            {
              x: width,
              y: rafterLength
            },
            { x: width, y: 0 }
          ],
          pitch: P1,
          sides: ["VERGE", "VERGE"]
        },
        {
          vertices: [
            {
              x: cutInDepth,
              y: 0
            },
            {
              x: 0,
              y: protrusionRafterLength
            },
            {
              x: B + cutInDepth,
              y: protrusionRafterLength
            },
            { x: B + cutInDepth, y: 0 }
          ],
          pitch: P2,
          sides: ["VALLEY", "VERGE"]
        },
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: protrusionRafterLength
            },
            {
              x: B + cutInDepth,
              y: protrusionRafterLength
            },
            { x: B, y: 0 }
          ],
          pitch: P2,
          sides: ["VERGE", "VALLEY"]
        },
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: D / 2,
              y: protrusionHeight
            },
            {
              x: D,
              y: 0
            }
          ],
          pitch: P1,
          sides: ["VALLEY", "VALLEY"],
          subtract: true
        }
      ],
      lines: {
        hip: [],
        ridge: [{ length: width }, { length: cutInDepth + B }],
        eave: [
          { length: A },
          { length: A },
          { length: width },
          { length: width },
          { length: B },
          { length: B }
        ],
        leftVerge: [
          { length: rafterLength },
          { length: rafterLength },
          { length: protrusionRafterLength }
        ],
        rightVerge: [
          { length: rafterLength },
          { length: rafterLength },
          { length: protrusionRafterLength }
        ],
        valley: [
          { length: cutInLength, top: true, start: true },
          { length: cutInLength, top: true, start: true }
        ]
      }
    };
  }
};

const roof3: Roof = {
  name: "3",
  type: "gable",
  illustration: Roof3Illustration,
  dimensionsIllustration: Roof3DimensionsIllustration,
  roofPitchField: "P1",
  fields: [
    {
      name: "A",
      type: "LENGTH"
    },
    {
      name: "B",
      type: "LENGTH"
    },
    {
      name: "C",
      type: "LENGTH"
    },
    {
      name: "D",
      type: "LENGTH"
    },
    {
      name: "E",
      type: "LENGTH"
    },
    {
      name: "P1",
      type: "PITCH"
    },
    {
      name: "P2",
      type: "PITCH"
    }
  ],
  getMeasurements: (values: DimensionsValues) => {
    const A = getMeasurement(values, "A") * 100;
    const B = getMeasurement(values, "B") * 100;
    const C = getMeasurement(values, "C") * 100;
    const D = getMeasurement(values, "D") * 100;
    const E = getMeasurement(values, "E") * 100;
    const width = C + D + E;
    const P1 = getMeasurement(values, "P1");
    const P2 = getMeasurement(values, "P2");

    const rafterLength = A / (2 * Math.cos((P1 * Math.PI) / 180));
    const protrusionRafterLength = D / (2 * Math.cos((P2 * Math.PI) / 180));
    const protrusionHeight = (D * Math.tan((P2 * Math.PI) / 180)) / 2;
    const cutInDepth = protrusionHeight / Math.tan((P1 * Math.PI) / 180);
    const cutInLength = Math.sqrt(
      cutInDepth ** 2 + protrusionRafterLength ** 2
    );

    return {
      faces: [
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: rafterLength
            },
            {
              x: width,
              y: rafterLength
            },
            { x: width, y: 0 }
          ],
          pitch: P1,
          sides: ["VERGE", "VERGE"]
        },
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: rafterLength
            },
            {
              x: width,
              y: rafterLength
            },
            { x: width, y: 0 }
          ],
          pitch: P1,
          sides: ["VERGE", "VERGE"]
        },
        {
          vertices: [
            {
              x: cutInDepth,
              y: 0
            },
            {
              x: 0,
              y: protrusionRafterLength
            },
            {
              x: B + cutInDepth,
              y: protrusionRafterLength
            },
            { x: B + cutInDepth, y: 0 }
          ],
          pitch: P2,
          sides: ["VALLEY", "VERGE"]
        },
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: protrusionRafterLength
            },
            {
              x: B + cutInDepth,
              y: protrusionRafterLength
            },
            { x: B, y: 0 }
          ],
          pitch: P2,
          sides: ["VERGE", "VALLEY"]
        },
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: D / 2,
              y: protrusionHeight
            },
            {
              x: D,
              y: 0
            }
          ],
          pitch: P1,
          sides: ["VALLEY", "VALLEY"],
          subtract: true
        }
      ],
      lines: {
        hip: [],
        ridge: [{ length: width }, { length: cutInDepth + B }],
        eave: [
          { length: A },
          { length: A },
          { length: width },
          { length: width },
          { length: B },
          { length: B }
        ],
        leftVerge: [
          { length: rafterLength },
          { length: rafterLength },
          { length: protrusionRafterLength }
        ],
        rightVerge: [
          { length: rafterLength },
          { length: rafterLength },
          { length: protrusionRafterLength }
        ],
        valley: [
          { length: cutInLength, end: true, start: true },
          { length: cutInLength, end: true, start: true }
        ]
      }
    };
  }
};

const roof4: Roof = {
  name: "4",
  type: "gable",
  illustration: Roof4Illustration,
  dimensionsIllustration: Roof4DimensionsIllustration,
  roofPitchField: "P1",
  fields: [
    {
      name: "A",
      type: "LENGTH"
    },
    {
      name: "B",
      type: "LENGTH"
    },
    {
      name: "C",
      type: "LENGTH"
    },
    {
      name: "D",
      type: "LENGTH"
    },
    {
      name: "P1",
      type: "PITCH"
    },
    {
      name: "P2",
      type: "PITCH"
    }
  ],
  getMeasurements: (values: DimensionsValues) => {
    const A = getMeasurement(values, "A") * 100;
    const B = getMeasurement(values, "B") * 100;
    const C = getMeasurement(values, "C") * 100;
    const D = getMeasurement(values, "D") * 100;
    const width = C + D;
    const P1 = getMeasurement(values, "P1");
    const P2 = getMeasurement(values, "P2");

    const rafterLength1 = A / (2 * Math.cos((P1 * Math.PI) / 180));
    const rafterLength2 = D / (2 * Math.cos((P2 * Math.PI) / 180));
    const valleyLength = Math.sqrt(rafterLength1 ** 2 + (D / 2) ** 2);
    const hipLength = Math.sqrt(rafterLength2 ** 2 + (D / 2) ** 2);

    return {
      faces: [
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: D / 2,
              y: rafterLength1
            },
            {
              x: width,
              y: rafterLength1
            },
            { x: width, y: 0 }
          ],
          pitch: P1,
          sides: ["HIP", "VERGE"]
        },
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: rafterLength2
            },
            {
              x: B + A / 2,
              y: rafterLength2
            },
            { x: B + A, y: 0 }
          ],
          pitch: P2,
          sides: ["VERGE", "HIP"]
        },
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: rafterLength1
            },
            {
              x: C + D / 2,
              y: rafterLength1
            },
            { x: C, y: 0 }
          ],
          pitch: P2,
          sides: ["VERGE", "VALLEY"]
        },
        {
          vertices: [
            {
              x: A / 2,
              y: 0
            },
            {
              x: 0,
              y: rafterLength2
            },
            {
              x: A / 2 + B,
              y: rafterLength2
            },
            { x: A / 2 + B, y: 0 }
          ],
          pitch: P2,
          sides: ["VALLEY", "VERGE"]
        }
      ],
      lines: {
        hip: [{ length: hipLength }],
        ridge: [{ length: C + D / 2 }, { length: B + A / 2 }],
        eave: [
          { length: C },
          { length: B },
          { length: A + B },
          { length: C + D }
        ],
        leftVerge: [{ length: rafterLength2 }, { length: rafterLength1 }],
        rightVerge: [{ length: rafterLength1 }, { length: rafterLength2 }],
        valley: [{ length: valleyLength, end: true, start: true }]
      }
    };
  }
};

const roof5: Roof = {
  name: "5",
  type: "gable",
  illustration: Roof5Illustration,
  dimensionsIllustration: Roof5DimensionsIllustration,
  roofPitchField: "P1",
  fields: [
    {
      name: "A",
      type: "LENGTH"
    },
    {
      name: "B",
      type: "LENGTH"
    },
    {
      name: "C",
      type: "PROTRUSION_LENGTH"
    },
    {
      name: "D",
      type: "PROTRUSION_LENGTH"
    },
    {
      name: "P1",
      type: "PITCH"
    },
    {
      name: "P2",
      type: "PITCH"
    }
  ],
  getMeasurements: (values: DimensionsValues) => {
    const A = getMeasurement(values, "A") * 100;
    const B = getMeasurement(values, "B") * 100;
    const C = getMeasurement(values, "C") * 100;
    const D = getMeasurement(values, "D") * 100;
    const P1 = getMeasurement(values, "P1");
    const P2 = getMeasurement(values, "P2");

    const rafterLength = A / (2 * Math.cos((P1 * Math.PI) / 180));

    const protrusionHeight = D / Math.cos((P2 * Math.PI) / 180);

    return {
      faces: [
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: rafterLength
            },
            {
              x: B,
              y: rafterLength
            },
            { x: B, y: 0 }
          ],
          pitch: P1,
          sides: ["VERGE", "VERGE"]
        },
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: rafterLength
            },
            {
              x: B,
              y: rafterLength
            },
            { x: B, y: 0 }
          ],
          pitch: P1,
          sides: ["VERGE", "VERGE"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: 0,
              y: protrusionHeight
            },
            { x: C, y: protrusionHeight },
            { x: C, y: 0 }
          ],
          pitch: P2,
          sides: ["VERGE", "VERGE"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: 0,
              y: D
            },
            { x: C, y: D },
            { x: C, y: 0 }
          ],
          pitch: P1,
          sides: ["VALLEY", "VALLEY"],
          subtract: true
        }
      ],
      lines: {
        hip: [],
        ridge: [{ length: B }],
        eave: [
          { length: A },
          { length: A },
          { length: B },
          { length: B },
          { length: C }
        ],
        leftVerge: [
          { length: rafterLength },
          { length: rafterLength },
          { length: protrusionHeight }
        ],
        rightVerge: [
          { length: rafterLength },
          { length: rafterLength },
          { length: protrusionHeight }
        ],
        valley: [
          { length: D, end: true },
          { length: D, end: true }
        ]
      }
    };
  }
};

const roof6: Roof = {
  name: "6",
  type: "gable",
  illustration: Roof6Illustration,
  dimensionsIllustration: Roof6DimensionsIllustration,
  roofPitchField: "P1",
  fields: [
    {
      name: "A",
      type: "LENGTH"
    },
    {
      name: "B",
      type: "LENGTH"
    },
    {
      name: "C",
      type: "PROTRUSION_LENGTH"
    },
    {
      name: "D",
      type: "PROTRUSION_LENGTH"
    },
    {
      name: "P1",
      type: "PITCH"
    },
    {
      name: "P2",
      type: "PITCH"
    }
  ],
  getMeasurements: (values: DimensionsValues) => {
    const A = getMeasurement(values, "A") * 100;
    const B = getMeasurement(values, "B") * 100;
    const C = getMeasurement(values, "C") * 100;
    const D = getMeasurement(values, "D") * 100;
    const P1 = getMeasurement(values, "P1");
    const P2 = getMeasurement(values, "P2");

    const rafterLength = A / (2 * Math.cos((P1 * Math.PI) / 180));

    const protrusionHeight = (C / 2) * Math.tan((P2 * Math.PI) / 180);
    const protrusionRafter = protrusionHeight / Math.sin((P2 * Math.PI) / 180);
    const protrusionDepth = protrusionHeight / Math.tan((P1 * Math.PI) / 180);

    const protrusionRidge = D;
    const protrusionValley = Math.sqrt(
      protrusionDepth ** 2 + protrusionRafter ** 2
    );

    return {
      faces: [
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: rafterLength
            },
            {
              x: B,
              y: rafterLength
            },
            { x: B, y: 0 }
          ],
          pitch: P1,
          sides: ["VERGE", "VERGE"]
        },
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: rafterLength
            },
            {
              x: B,
              y: rafterLength
            },
            { x: B, y: 0 }
          ],
          pitch: P1,
          sides: ["VERGE", "VERGE"]
        },
        // Protrusion
        {
          vertices: [
            { x: protrusionDepth, y: 0 },
            {
              x: 0,
              y: protrusionRafter
            },
            { x: D, y: protrusionRafter },
            { x: D, y: 0 }
          ],
          pitch: P2,
          sides: ["VALLEY", "VERGE"]
        },
        {
          vertices: [
            { x: protrusionDepth, y: 0 },
            {
              x: 0,
              y: protrusionRafter
            },
            { x: D, y: protrusionRafter },
            { x: D, y: 0 }
          ],
          pitch: P2,
          sides: ["VERGE", "VALLEY"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: C / 2,
              y: protrusionHeight
            },
            { x: C, y: 0 }
          ],
          pitch: P1,
          sides: ["VALLEY", "VALLEY"],
          subtract: true
        }
      ],
      lines: {
        hip: [],
        ridge: [{ length: B }, { length: protrusionRidge }],
        eave: [
          { length: A },
          { length: A },
          { length: B },
          { length: B },
          { length: D - protrusionDepth },
          { length: D - protrusionDepth }
        ],
        leftVerge: [
          { length: rafterLength },
          { length: rafterLength },
          { length: protrusionRafter }
        ],
        rightVerge: [
          { length: rafterLength },
          { length: rafterLength },
          { length: protrusionRafter }
        ],
        valley: [
          { length: protrusionValley, dormerStart: true, end: true },
          { length: protrusionValley, dormerStart: true, end: true }
        ]
      }
    };
  }
};

const roof7: Roof = {
  name: "7",
  type: "hipped",
  illustration: Roof7Illustration,
  dimensionsIllustration: Roof7DimensionsIllustration,
  roofPitchField: "P",
  fields: [
    {
      name: "A",
      type: "LENGTH"
    },
    {
      name: "B",
      type: "LENGTH"
    },
    {
      name: "P",
      type: "PITCH"
    }
  ],
  getMeasurements: (values: DimensionsValues) => {
    const A = getMeasurement(values, "A") * 100;
    const B = getMeasurement(values, "B") * 100;
    const P = getMeasurement(values, "P");

    const height = (A / 2) * Math.tan((P * Math.PI) / 180);
    const planeHeight = height / Math.sin((P * Math.PI) / 180);
    const planeTwoJointDisplacement = height / Math.tan((P * Math.PI) / 180);

    const hip = Math.sqrt((A / 2) ** 2 + planeHeight ** 2);
    const ridge = B - 2 * planeTwoJointDisplacement;

    return {
      faces: [
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: A / 2,
              y: planeHeight
            },
            { x: A, y: 0 }
          ],
          pitch: P,
          sides: ["HIP", "HIP"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: A / 2,
              y: planeHeight
            },
            { x: A, y: 0 }
          ],
          pitch: P,
          sides: ["HIP", "HIP"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: planeTwoJointDisplacement,
              y: planeHeight
            },
            {
              x: B - planeTwoJointDisplacement,
              y: planeHeight
            },
            { x: B, y: 0 }
          ],
          pitch: P,
          sides: ["HIP", "HIP"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: planeTwoJointDisplacement,
              y: planeHeight
            },
            {
              x: B - planeTwoJointDisplacement,
              y: planeHeight
            },
            { x: B, y: 0 }
          ],
          pitch: P,
          sides: ["HIP", "HIP"]
        }
      ],
      lines: {
        hip: [
          { length: hip },
          { length: hip },
          { length: hip },
          { length: hip }
        ],
        ridge: [{ length: ridge }],
        eave: [{ length: A }, { length: A }, { length: B }, { length: B }],
        leftVerge: [],
        rightVerge: [],
        valley: []
      }
    };
  }
};

const roof8: Roof = {
  name: "8",
  type: "hipped",
  illustration: Roof8Illustration,
  dimensionsIllustration: Roof8DimensionsIllustration,
  roofPitchField: "P1",
  fields: [
    {
      name: "A",
      type: "LENGTH"
    },
    {
      name: "B",
      type: "LENGTH"
    },
    {
      name: "C",
      type: "LENGTH"
    },
    {
      name: "D",
      type: "LENGTH"
    },
    {
      name: "E",
      type: "LENGTH"
    },
    {
      name: "P1",
      type: "PITCH"
    },
    {
      name: "P2",
      type: "PITCH"
    },
    {
      name: "P3",
      type: "PITCH"
    }
  ],
  getMeasurements: (values: DimensionsValues) => {
    const A = getMeasurement(values, "A") * 100;
    const B = getMeasurement(values, "B") * 100;
    const C = getMeasurement(values, "C") * 100;
    const D = getMeasurement(values, "D") * 100;
    const E = getMeasurement(values, "E") * 100;
    const width = C + D + E;
    const P1 = getMeasurement(values, "P1");
    const P2 = getMeasurement(values, "P2");
    const P3 = getMeasurement(values, "P3");
    const height = (A / 2) * Math.tan((P2 * Math.PI) / 180);
    const rafter = height / Math.sin((P1 * Math.PI) / 180);
    const planeJointDisplacement = height / Math.tan((P1 * Math.PI) / 180);

    const hip = Math.sqrt((A / 2) ** 2 + rafter ** 2);
    const ridge = width - 2 * planeJointDisplacement;

    const protrusionHeight = (D / 2) * Math.tan((P3 * Math.PI) / 180);
    const protrusionRafter = protrusionHeight / Math.sin((P3 * Math.PI) / 180);
    const protrusionDepth = protrusionHeight / Math.tan((P2 * Math.PI) / 180);

    const protrusionRidge = B + protrusionDepth;
    const protrusionValley = Math.sqrt(
      protrusionDepth ** 2 + protrusionRafter ** 2
    );

    return {
      faces: [
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: A / 2,
              y: rafter
            },
            { x: A, y: 0 }
          ],
          pitch: P1,
          sides: ["HIP", "HIP"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: A / 2,
              y: rafter
            },
            { x: A, y: 0 }
          ],
          pitch: P1,
          sides: ["HIP", "HIP"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: planeJointDisplacement,
              y: rafter
            },
            {
              x: width - planeJointDisplacement,
              y: rafter
            },
            { x: width, y: 0 }
          ],
          pitch: P2,
          sides: ["HIP", "HIP"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: planeJointDisplacement,
              y: rafter
            },
            {
              x: width - planeJointDisplacement,
              y: rafter
            },
            { x: width, y: 0 }
          ],
          pitch: P2,
          sides: ["HIP", "HIP"]
        },
        // Protrusion
        {
          vertices: [
            { x: protrusionDepth, y: 0 },
            {
              x: 0,
              y: protrusionRafter
            },
            {
              x: protrusionRidge,
              y: protrusionRafter
            },
            { x: protrusionRafter, y: 0 }
          ],
          pitch: P3,
          sides: ["VALLEY", "HIP"]
        },
        {
          vertices: [
            { x: protrusionDepth, y: 0 },
            {
              x: 0,
              y: protrusionRafter
            },
            {
              x: protrusionRidge,
              y: protrusionRafter
            },
            { x: protrusionRafter, y: 0 }
          ],
          pitch: P3,
          sides: ["HIP", "VALLEY"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: D / 2,
              y: protrusionHeight
            },
            { x: D, y: 0 }
          ],
          pitch: P2,
          sides: ["VALLEY", "VALLEY"],
          subtract: true
        }
      ],
      lines: {
        hip: [
          { length: hip },
          { length: hip },
          { length: hip },
          { length: hip }
        ],
        ridge: [{ length: ridge }, { length: protrusionRidge }],
        eave: [
          { length: A },
          { length: A },
          { length: width },
          { length: width },
          { length: B },
          { length: B }
        ],
        leftVerge: [],
        rightVerge: [],
        valley: [
          { length: protrusionValley, top: true, start: true },
          { length: protrusionValley, top: true, start: true }
        ]
      }
    };
  }
};

const roof9: Roof = {
  name: "9",
  type: "hipped",
  illustration: Roof9Illustration,
  dimensionsIllustration: Roof9DimensionsIllustration,
  roofPitchField: "P1",
  fields: [
    {
      name: "A",
      type: "LENGTH"
    },
    {
      name: "B",
      type: "LENGTH"
    },
    {
      name: "C",
      type: "LENGTH"
    },
    {
      name: "D",
      type: "LENGTH"
    },
    {
      name: "E",
      type: "LENGTH"
    },
    {
      name: "P1",
      type: "PITCH"
    },
    {
      name: "P2",
      type: "PITCH"
    },
    {
      name: "P3",
      type: "PITCH"
    }
  ],
  getMeasurements: (values: DimensionsValues) => {
    const A = getMeasurement(values, "A") * 100;
    const B = getMeasurement(values, "B") * 100;
    const C = getMeasurement(values, "C") * 100;
    const D = getMeasurement(values, "D") * 100;
    const E = getMeasurement(values, "E") * 100;
    const width = C + D + E;
    const P1 = getMeasurement(values, "P1");
    const P2 = getMeasurement(values, "P2");
    const P3 = getMeasurement(values, "P3");

    const height = (A / 2) * Math.tan((P2 * Math.PI) / 180);
    const rafter = height / Math.sin((P1 * Math.PI) / 180);
    const planeJointDisplacement = height / Math.tan((P1 * Math.PI) / 180);

    const hip = Math.sqrt((A / 2) ** 2 + rafter ** 2);
    const ridge = width - 2 * planeJointDisplacement;

    const protrusionHeight = (D / 2) * Math.tan((P3 * Math.PI) / 180);
    const protrusionRafter = protrusionHeight / Math.sin((P3 * Math.PI) / 180);
    const protrusionTopDisplacement =
      protrusionHeight / Math.tan((P3 * Math.PI) / 180);
    const protrusionDepth = protrusionHeight / Math.tan((P2 * Math.PI) / 180);

    const protrusionHip = Math.sqrt((D / 2) ** 2 + protrusionRafter ** 2);
    const protrusionRidge = B + protrusionDepth - protrusionTopDisplacement;
    const protrusionValley = Math.sqrt(
      protrusionDepth ** 2 + protrusionRafter ** 2
    );

    return {
      faces: [
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: A / 2,
              y: rafter
            },
            { x: A, y: 0 }
          ],
          pitch: P1,
          sides: ["HIP", "HIP"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: A / 2,
              y: rafter
            },
            { x: A, y: 0 }
          ],
          pitch: P1,
          sides: ["HIP", "HIP"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: planeJointDisplacement,
              y: rafter
            },
            {
              x: width - planeJointDisplacement,
              y: rafter
            },
            { x: width, y: 0 }
          ],
          pitch: P2,
          sides: ["HIP", "HIP"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: planeJointDisplacement,
              y: rafter
            },
            {
              x: width - planeJointDisplacement,
              y: rafter
            },
            { x: width, y: 0 }
          ],
          pitch: P2,
          sides: ["HIP", "HIP"]
        },
        // Protrusion
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: D / 2,
              y: protrusionRafter
            },
            { x: D, y: 0 }
          ],
          pitch: P3,
          sides: ["HIP", "HIP"]
        },
        {
          vertices: [
            { x: protrusionDepth, y: 0 },
            {
              x: 0,
              y: protrusionRafter
            },
            {
              x: protrusionRidge,
              y: protrusionRafter
            },
            { x: protrusionDepth + B, y: 0 }
          ],
          pitch: P3,
          sides: ["VALLEY", "HIP"]
        },
        {
          vertices: [
            { x: protrusionDepth, y: 0 },
            {
              x: 0,
              y: protrusionRafter
            },
            {
              x: protrusionRidge,
              y: protrusionRafter
            },
            { x: protrusionDepth + B, y: 0 }
          ],
          pitch: P3,
          sides: ["HIP", "VALLEY"]
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: D / 2,
              y: protrusionHeight
            },
            { x: D, y: 0 }
          ],
          pitch: P2,
          sides: ["VALLEY", "VALLEY"],
          subtract: true
        }
      ],
      lines: {
        hip: [
          { length: hip },
          { length: hip },
          { length: hip },
          { length: hip },
          { length: protrusionHip },
          { length: protrusionHip }
        ],
        ridge: [{ length: ridge }, { length: protrusionRidge }],
        eave: [
          { length: A },
          { length: A },
          { length: width },
          { length: width },
          { length: B },
          { length: B },
          { length: D }
        ],
        leftVerge: [],
        rightVerge: [],
        valley: [
          { length: protrusionValley, top: true, start: true },
          { length: protrusionValley, top: true, start: true }
        ]
      }
    };
  }
};

const roof10: Roof = {
  name: "10",
  type: "sloped",
  illustration: Roof10Illustration,
  dimensionsIllustration: Roof10DimensionsIllustration,
  roofPitchField: "P",
  fields: [
    {
      name: "A",
      type: "LENGTH"
    },
    {
      name: "B",
      type: "LENGTH"
    },
    {
      name: "P",
      type: "PITCH"
    }
  ],
  getMeasurements: (values: DimensionsValues) => {
    const A = getMeasurement(values, "A") * 100;
    const B = getMeasurement(values, "B") * 100;
    const P = getMeasurement(values, "P");

    const rafterLength = A / Math.cos((P * Math.PI) / 180);

    return {
      faces: [
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: rafterLength
            },
            {
              x: B,
              y: rafterLength
            },
            { x: B, y: 0 }
          ],
          pitch: P,
          sides: ["VERGE", "VERGE"]
        }
      ],
      lines: {
        hip: [],
        ridge: [],
        eave: [{ length: B }],
        leftVerge: [{ length: rafterLength }],
        rightVerge: [{ length: rafterLength }],
        valley: []
      }
    };
  }
};

export default [
  roof1,
  roof2,
  roof3,
  roof4,
  roof5,
  roof6,
  roof7,
  roof8,
  roof9,
  roof10
] as Roof[];
