import demoImage from "../images/demo-product.jpg";
import { Guttering, LengthBasedProduct } from "../types";

export const guttering: Guttering[] = [
  {
    code: "Test_Guttering",
    name: "Test Guttering",
    image: demoImage,
    variants: [
      {
        code: "Test_Guttering_Black",
        name: "Test Guttering Black",
        externalProductCode: "34391",
        image: demoImage,
        length: 600,
        downpipe: {
          code: "Downpipe",
          name: "Downpipe",
          image: demoImage,
          externalProductCode: "33332",
          packSize: undefined,
          category: "accessories"
        },
        downpipeConnector: {
          code: "Downpipe_Connector",
          name: "Downpipe Connector",
          image: demoImage,
          externalProductCode: "33331",
          packSize: undefined,
          category: "accessories"
        }
      },
      {
        code: "Test_Guttering_Grey",
        name: "Test Guttering Grey",
        externalProductCode: "4391",
        image: demoImage,
        length: 600,
        downpipe: {
          code: "Downpipe",
          name: "Downpipe",
          image: demoImage,
          externalProductCode: "33332",
          packSize: undefined,
          category: "accessories"
        },
        downpipeConnector: {
          code: "Downpipe_Connector",
          name: "Downpipe Connector",
          image: demoImage,
          externalProductCode: "33331",
          packSize: undefined,
          category: "accessories"
        }
      }
    ]
  }
];

export const hooks: LengthBasedProduct[] = [
  {
    code: "Test_Guttering_Hook_Black",
    name: "Test Guttering Hook Black",
    externalProductCode: "34392",
    image: demoImage,
    length: 400
  },
  {
    code: "Test_Guttering_Hook_Grey",
    name: "Test Guttering Hook Grey",
    externalProductCode: "4392",
    image: demoImage,
    length: 400
  }
];
