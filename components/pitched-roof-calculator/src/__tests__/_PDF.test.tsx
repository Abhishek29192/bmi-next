import React from "react";
import { pdf } from "react-pdf-maker";
import en from "../samples/copy/en.json";
import { getPDF, Typography } from "../_PDF";
import { getMicroCopy } from "../helpers/microCopy";
import { ResultsObject } from "../types";

const resultsSample: ResultsObject = {
  tiles: [
    {
      category: "tiles",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      description: "Zanda Protector main tile black",
      externalProductCode: "46035712",
      packSize: "-",
      quantity: 1350
    },
    {
      category: "tiles",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      description: "Zanda Protector half tile black",
      externalProductCode: "46035795",
      packSize: "-",
      quantity: 30
    },
    {
      category: "tiles",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
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
      category: "ventilation",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      description: "Ventilation Hood 1",
      externalProductCode: "100456781",
      packSize: "-",
      quantity: 1
    }
  ],
  accessories: [
    {
      category: "accessories",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      description: "Zanda_Protector_verge metal flush black left start",
      externalProductCode: "86035763",
      packSize: "-",
      quantity: 2
    },
    {
      category: "accessories",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      description: "Zanda_Protector_verge metal flush black left",
      externalProductCode: "86035761",
      packSize: "-",
      quantity: 100
    },
    {
      category: "accessories",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      description: "Zanda_Protector_verge metal flush black right start",
      externalProductCode: "86035764",
      packSize: "-",
      quantity: 2
    },
    {
      category: "accessories",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      description: "Zanda_Protector_verge metal flush black right",
      externalProductCode: "86035762",
      packSize: "-",
      quantity: 100
    },
    {
      category: "accessories",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      description: "Clips",
      externalProductCode: "113456781",
      packSize: "-",
      quantity: 92
    },
    {
      category: "accessories",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      description: "Ridge and Hip Screw",
      externalProductCode: "113456782",
      packSize: "-",
      quantity: 92
    },
    {
      category: "accessories",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      description: "Long Screw",
      externalProductCode: "113456783",
      packSize: "-",
      quantity: 267
    },
    {
      category: "accessories",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      description: "Screw",
      externalProductCode: "113456784",
      packSize: "-",
      quantity: 1249
    },
    {
      category: "accessories",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      description: "Finishing Kit",
      externalProductCode: "113456786",
      packSize: "-",
      quantity: 1
    },
    {
      category: "accessories",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      description: "Underlay Divoroll TOP RU",
      externalProductCode: "26583450",
      packSize: "-",
      quantity: 3
    },
    {
      category: "accessories",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      description: "Fuglelist ventilert",
      externalProductCode: "5555551",
      packSize: "-",
      quantity: 6
    },
    {
      category: "accessories",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      description: "Other accesories example",
      externalProductCode: "5555550",
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

    expect(file.docDefinition).toMatchSnapshot();
  });

  it("avoids rendering empty tables results", () => {
    const file = getPDF({
      results: {
        tiles: [],
        fixings: [],
        sealing: [],
        ventilation: [],
        accessories: []
      },
      area: "150",
      getMicroCopy: (...params) => getMicroCopy(en, ...params)
    });

    expect(file.docDefinition).toMatchSnapshot();
  });
});

describe("PitchedRoofCalculator PDF components", () => {
  it("renders h1 Typograph correctly", () => {
    const file = pdf(<Typography variant="h1">Heading 1</Typography>);

    expect(file.docDefinition).toMatchSnapshot();
  });
});
