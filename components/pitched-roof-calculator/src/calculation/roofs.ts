import Roof4Illustration from "../images/roof-shapes/roof024.svg";
import Roof7Illustration from "../images/roof-shapes/roof007.svg";
import Roof4DimensionsIllustration from "../images/roof-dimensions/4.svg";
import Roof7DimensionsIllustration from "../images/roof-dimensions/7.svg";

const roof4 = {
  name: "Roof 4",
  type: "gable",
  selectionIllustration: Roof4Illustration,
  dimensionsIllustration: Roof4DimensionsIllustration,
  dimensions: [
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
  getMeasurements: ({ A, B, C, P1 }) => {
    const rafterlength = C / (2 * Math.cos((P1 * Math.PI) / 180));
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
              y: rafterlength
            },
            {
              x: A + C / 2,
              y: rafterlength
            },
            { x: A, y: 0 }
          ],
          pitch: P1
        },
        {
          vertices: [
            {
              x: C / 2,
              y: 0
            },
            {
              x: 0,
              y: rafterlength
            },
            {
              x: C / 2 + B,
              y: rafterlength
            },
            {
              x: C / 2 + B,
              y: 0
            }
          ],
          pitch: P1
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: C / 2,
              y: rafterlength
            },
            {
              x: A + C,
              y: rafterlength
            },
            { x: A + C, y: 0 }
          ],
          pitch: P1
        },
        {
          vertices: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: rafterlength
            },
            {
              x: B + C / 2,
              y: rafterlength
            },
            { x: B + C, y: 0 }
          ],
          pitch: P1
        }
      ]
    };
  }
};

const roof7 = {
  name: "Roof 7",
  type: "hipped",
  selectionIllustration: Roof7Illustration,
  dimensionsIllustration: Roof7DimensionsIllustration,
  dimensions: [
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
  getMeasurements: ({ A, B, P1 }) => {
    const P2 = P1;
    const height = (B / 2) * Math.tan((P1 * Math.PI) / 180);
    const planeOneHeight = height / Math.sin((P2 * Math.PI) / 180);
    const planeTwoHeight = height / Math.sin((P1 * Math.PI) / 180);
    const planeTwoJointDisplacement = height / Math.tan((P2 * Math.PI) / 180);
    return {
      faces: [
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: B / 2,
              y: planeOneHeight
            },
            { x: B, y: 0 }
          ],
          pitch: P2
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: B / 2,
              y: planeOneHeight
            },
            { x: B, y: 0 }
          ],
          pitch: P2
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: planeTwoJointDisplacement,
              y: planeTwoHeight
            },
            {
              x: A - planeTwoJointDisplacement,
              y: planeTwoHeight
            },
            { x: A, y: 0 }
          ],
          pitch: P1
        },
        {
          vertices: [
            { x: 0, y: 0 },
            {
              x: planeTwoJointDisplacement,
              y: planeTwoHeight
            },
            {
              x: A - planeTwoJointDisplacement,
              y: planeTwoHeight
            },
            { x: A, y: 0 }
          ],
          pitch: P1
        }
      ]
    };
  }
};

export default [roof4, roof7];
