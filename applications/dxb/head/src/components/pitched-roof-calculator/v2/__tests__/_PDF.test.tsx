import { pdf } from "@bmi-digital/react-pdf-maker";
import React from "react";
import { getMicroCopy } from "../../helpers/microCopy";
import en from "../../samples/copy/en.json";
import { ResultsObject } from "../../types/v2";

import { ProductCategory } from "../../types";
import { getPDF, shouldAddPageBreak, Typography } from "../_PDF";

const resultsSample: ResultsObject = {
  tiles: [
    {
      category: ProductCategory.Tiles,
      image: "data:image/jpg;base64,imagedata",
      description: "Zanda Protector main tile black",
      externalProductCode: "46035712",
      packSize: "-",
      quantity: 1350
    },
    {
      category: ProductCategory.Tiles,
      image: "data:image/jpg;base64,imagedata",
      description: "Zanda Protector half tile black",
      externalProductCode: "46035795",
      packSize: "-",
      quantity: 30
    },
    {
      category: ProductCategory.Tiles,
      image: "data:image/jpg;base64,imagedata",
      description: "Zanda_Protector_ridge tile black",
      externalProductCode: "46035761",
      packSize: "-",
      quantity: 46
    }
  ],
  fixings: [],
  sealing: [],
  ventilation: [
    {
      category: ProductCategory.Ventilation,
      image: "",
      description: "Ventilation Hood 1",
      externalProductCode: "100456781",
      packSize: "-",
      quantity: 1
    }
  ],
  accessories: [
    {
      category: ProductCategory.Accessories,
      image: "data:image/jpg;base64,imagedata",
      description: "Zanda_Protector_verge metal flush black left start",
      externalProductCode: "86035763",
      packSize: "-",
      quantity: 2
    },
    {
      category: ProductCategory.Accessories,
      image: "data:image/jpg;base64,imagedata",
      description: "Zanda_Protector_verge metal flush black left",
      externalProductCode: "86035761",
      packSize: "-",
      quantity: 100
    },
    {
      category: ProductCategory.Accessories,
      image: "data:image/jpg;base64,imagedata",
      description: "Zanda_Protector_verge metal flush black right start",
      externalProductCode: "86035764",
      packSize: "-",
      quantity: 2
    },
    {
      category: ProductCategory.Accessories,
      image: "data:image/jpg;base64,imagedata",
      description: "Zanda_Protector_verge metal flush black right",
      externalProductCode: "86035762",
      packSize: "-",
      quantity: 100
    },
    {
      category: ProductCategory.Accessories,
      image: "",
      description: "Clips",
      externalProductCode: "113456781",
      packSize: "-",
      quantity: 92
    },
    {
      category: ProductCategory.Accessories,
      image: "",
      description: "Ridge and Hip Screw",
      externalProductCode: "113456782",
      packSize: "-",
      quantity: 92
    },
    {
      category: ProductCategory.Accessories,
      image: "",
      description: "Long Screw",
      externalProductCode: "113456783",
      packSize: "-",
      quantity: 267
    },
    {
      category: ProductCategory.Accessories,
      image: "",
      description: "Screw",
      externalProductCode: "113456784",
      packSize: "-",
      quantity: 1249
    },
    {
      category: ProductCategory.Accessories,
      image: "",
      description: "Finishing Kit",
      externalProductCode: "113456786",
      packSize: "-",
      quantity: 1
    },
    {
      category: ProductCategory.Accessories,
      image: "data:image/jpg;base64,imagedata",
      description: "Underlay Divoroll TOP RU",
      externalProductCode: "26583450",
      packSize: "-",
      quantity: 3
    },
    {
      category: ProductCategory.Accessories,
      image: "data:image/jpg;base64,imagedata",
      description: "Fuglelist ventilert",
      externalProductCode: "5555551",
      packSize: "-",
      quantity: 6
    },
    {
      category: ProductCategory.Accessories,
      image: "data:image/jpg;base64,imagedata",
      description: "Other accesories example",
      externalProductCode: "5555550",
      packSize: "-",
      quantity: 0
    }
  ],
  extras: [
    {
      category: ProductCategory.Accessories,
      image: "data:image/jpg;base64,imagedata",
      description: "Ling screw",
      externalProductCode: "4325423",
      packSize: "-",
      quantity: 0
    }
  ]
};

describe("PitchedRoofCalculator PDF tool", () => {
  it("renders PDF correctly", () => {
    const file = getPDF({
      results: resultsSample,
      area: "150",
      getMicroCopy: (...params) => getMicroCopy(en, ...params)
    });

    expect(file).toMatchSnapshot();
  });

  it("avoids rendering empty tables results", () => {
    const file = getPDF({
      results: {
        tiles: [],
        fixings: [],
        sealing: [],
        ventilation: [],
        accessories: [],
        extras: []
      },
      area: "150",
      getMicroCopy: (...params) => getMicroCopy(en, ...params)
    });

    expect(file).toMatchSnapshot();
  });
});

describe("PitchedRoofCalculator PDF components", () => {
  it("renders h1 Typograph correctly", () => {
    const file = pdf(<Typography variant="h1">Heading 1</Typography>);

    expect(file).toMatchSnapshot();
  });
});

describe("PitchedRoofCalculator shouldAddPageBreak function", () => {
  const startPositionMock = { pageInnerHeight: 758, top: 780 };

  const node = {
    text: "mock",
    height: 50,
    startPosition: startPositionMock,
    stack: false,
    pages: 1,
    pageNumbers: []
  };

  it("returns true if node height is greater than available space on the page", () => {
    expect(
      shouldAddPageBreak(
        {
          text: "mock",
          height: 30,
          startPosition: startPositionMock
        },
        [],
        [node],
        [node]
      )
    ).toBeTruthy();

    expect(
      shouldAddPageBreak(
        {
          startPosition: {
            text: "mock",
            height: 50,
            ...startPositionMock
          }
        },
        [],
        [node],
        [node]
      )
    ).toBeTruthy();
  });

  it("returns false if previous nodes do not exist", () => {
    expect(
      shouldAddPageBreak(
        { startPosition: { ...startPositionMock } },
        [],
        [],
        []
      )
    ).toBeFalsy();
  });

  it("returns false for svg", () => {
    expect(
      shouldAddPageBreak(
        {
          svg: <svg></svg>,
          startPosition: { ...startPositionMock }
        },
        [],
        [],
        [node]
      )
    ).toBeFalsy();
  });

  it("returns false if nodes for the next page do not exist", () => {
    expect(
      shouldAddPageBreak(
        {
          startPosition: { ...startPositionMock, top: 100 }
        },
        [],
        [],
        [node]
      )
    ).toBeFalsy();
  });

  it("returns false by default", () => {
    expect(
      shouldAddPageBreak(
        {
          startPosition: { ...startPositionMock, top: 100 }
        },
        [],
        [node],
        [node]
      )
    ).toBeFalsy();
  });
});
