import demoImage from "../images/demo-product.jpg";

export const guttering = [
  {
    name: "Test Guttering",
    image: demoImage,
    variants: [
      {
        name: "Test Guttering Black",
        externalProductCode: "34391",
        image: demoImage,
        length: 600,
        downpipe: {
          image: demoImage,
          description: "Downpipe",
          externalProductCode: "33332",
          packSize: "-",
          productAmount: 0
        },
        downpipeConnector: {
          image: demoImage,
          description: "Downpipe Connector",
          externalProductCode: "33331",
          packSize: "-",
          productAmount: 0
        }
      },
      {
        name: "Test Guttering Grey",
        externalProductCode: "4391",
        image: demoImage,
        length: 600,
        downpipe: {
          image: demoImage,
          description: "Downpipe",
          externalProductCode: "33332",
          packSize: "-",
          productAmount: 0
        },
        downpipeConnector: {
          image: demoImage,
          description: "Downpipe Connector",
          externalProductCode: "33331",
          packSize: "-",
          productAmount: 0
        }
      }
    ]
  }
];

export const hooks = [
  {
    name: "Test Guttering Hook Black",
    externalProductCode: "34392",
    image: demoImage,
    length: 400
  },
  {
    name: "Test Guttering Hook Grey",
    externalProductCode: "4392",
    image: demoImage,
    length: 400
  }
];
