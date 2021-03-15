import Roof7Illustration from "../images/roof-shapes/roof007.svg";
import Roof7DimensionsIllustration from "../images/roof-dimensions/7.svg";

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
  getMeasurements: (values) => {
    const A = parseFloat(values.A) * 100;
    const B = parseFloat(values.B) * 100;
    const P = parseFloat(values.P);
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
          pitch: P
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
          pitch: P
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
          pitch: P
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
          pitch: P
        }
      ],
      lines: {
        hip: [hip, hip, hip, hip],
        ridge: [ridge],
        eave: [A, A, B, B],
        verge: []
      }
    };
  }
};

export default [roof7];
