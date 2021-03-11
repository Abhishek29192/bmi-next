import demoImage from "../images/demo-product.jpg";
import demoFormattedImage from "../images/demo-product-format.jpg";

const ZandaArktis = {
  code: "Zanda_Arkitis",
  name: "Zanda Arktis",
  category: "concrete",
  image: demoImage,
  minBattenGauge: 0.31,
  maxBattenGauge: [
    {
      start: 15,
      end: 31,
      value: 0.38
    },
    {
      start: 31,
      end: 45,
      value: 0.485
    }
  ],
  eaveGauge: [
    {
      start: 15,
      end: 31,
      value: 0.38
    },
    {
      start: 31,
      end: 45,
      value: 0.385
    }
  ],
  ridgeSpacing: [
    {
      start: 10,
      end: 90,
      value: 0.015
    },
    {
      start: 15,
      end: 55,
      value: 0.05
    }
  ],
  width: 0.3,
  height: 0.5,
  brokenBond: true,
  variants: [
    {
      code: "Zanda_Arktis_Red",
      name: "Zanda Arktis Red",
      externalProductCode: "123444",
      image: demoImage,
      color: "Red",
      maxBattenGauge: [],
      eaveGauge: [],
      ridgeSpacing: [],
      ridgeOptions: [
        {
          name: "Ridge Tile",
          image: demoImage,
          externalProductCode: "21259"
        },
        {
          name: "Ridge Metal Flush",
          image: demoFormattedImage,
          externalProductCode: "22455"
        }
      ],
      vergeOptions: [
        {
          name: "Verge Metal Flush",
          left: {
            image: demoFormattedImage
          }
        }
      ]
    }
  ]
};

export default [ZandaArktis];
