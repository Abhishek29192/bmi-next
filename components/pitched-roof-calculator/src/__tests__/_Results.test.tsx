import React from "react";
import { Props } from "@bmi/quantity-table/src/QuantityTable";
import { render, fireEvent, waitFor } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import fetchMockJest from "fetch-mock-jest";
import { MicroCopy } from "../helpers/microCopy";
import data from "../samples/data.json";
import en from "../samples/copy/en.json";
import Results from "../_Results";
import { Measurements } from "../types/roof";

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  global.open = jest.fn();
});

jest.mock("@bmi/quantity-table", () => {
  const QuantityTable = (props: Props) => (
    <p>{JSON.stringify(props, null, 2)}</p>
  );

  return {
    __esModule: true,
    default: QuantityTable
  };
});

let openPDF: jest.Mock;
jest.mock("../_PDF", () => {
  openPDF = jest.fn();
  return {
    __esModule: true,
    default: openPDF
  };
});
global.open = jest.fn();

const resultsProps = {
  measurements: {
    faces: [
      {
        vertices: [
          {
            x: 0,
            y: 0
          },
          {
            x: 0,
            y: 505.04680693546237
          },
          {
            x: 1500,
            y: 505.04680693546237
          },
          {
            x: 1500,
            y: 0
          }
        ],
        pitch: 27,
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
            y: 505.04680693546237
          },
          {
            x: 1500,
            y: 505.04680693546237
          },
          {
            x: 1500,
            y: 0
          }
        ],
        pitch: 27,
        sides: ["VERGE", "VERGE"]
      }
    ],
    lines: {
      hip: [],
      ridge: [
        {
          length: 1500
        }
      ],
      eave: [
        {
          length: 900
        },
        {
          length: 900
        },
        {
          length: 1500
        },
        {
          length: 1500
        }
      ],
      leftVerge: [
        {
          length: 505.04680693546237
        },
        {
          length: 505.04680693546237
        }
      ],
      rightVerge: [
        {
          length: 505.04680693546237
        },
        {
          length: 505.04680693546237
        }
      ],
      valley: []
    },
    area: 1515140.4208063872
  } as Measurements,
  variant: {
    code: "175200122_Zanda_Protector_main_tile_black",
    name: "Zanda Protector main tile black",
    externalProductCode: "46035712",
    image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
    color: "Black",
    halfTile: {
      code: "275102122_Zanda_Protector_half_tile_black",
      name: "Zanda Protector half tile black",
      externalProductCode: "46035795",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      width: 18
    },
    hip: {
      code: "249702122_Zanda_Protector_ridge_tile_black",
      name: "Zanda_Protector_ridge tile black",
      externalProductCode: "46035761",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      length: 33.33
    },
    ridgeOptions: [
      {
        code: "249702122_Zanda_Protector_ridge_tile_black",
        name: "Zanda_Protector_ridge tile black",
        externalProductCode: "46035761",
        image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
        length: 33.33
      },
      {
        code: "249702122_Zanda_Protector_SAMPLE_RIDGE_METAL_FLUSH",
        name: "Zanda_Protector_ridge sample metal flush black",
        externalProductCode: "46035001",
        image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
        length: 33.33
      }
    ],
    vergeOptions: [
      {
        type: "METAL_FLUSH",
        name: "Verge Metal Flush",
        left: {
          code: "849702122_Zanda_Protector_verge_metal_flush_black_left",
          name: "Zanda_Protector_verge metal flush black left",
          externalProductCode: "86035761",
          image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
          length: 10
        },
        right: {
          code: "849702122_Zanda_Protector_verge_metal_flush_black_right",
          name: "Zanda_Protector_verge metal flush black right",
          externalProductCode: "86035762",
          image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
          length: 10
        },
        leftStart: {
          code: "849702122_Zanda_Protector_verge_metal_flush_black_left_start",
          name: "Zanda_Protector_verge metal flush black left start",
          externalProductCode: "86035763",
          image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
          length: 10
        },
        rightStart: {
          code: "849702122_Zanda_Protector_verge_metal_flush_black_right_start",
          name: "Zanda_Protector_verge metal flush black right start",
          externalProductCode: "86035764",
          image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
          length: 10
        }
      },
      {
        type: "TILE",
        name: "Verge Tile",
        left: {
          code: "849702122_Zanda_Protector_verge_tile_black_left",
          name: "Zanda_Protector_verge tile black left",
          externalProductCode: "87035761",
          image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
          width: 30
        },
        right: {
          code: "849702122_Zanda_Protector_verge_tile_black_right",
          name: "Zanda_Protector_verge tile black right",
          externalProductCode: "87035762",
          image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
          width: 30
        },
        halfLeft: {
          code: "849702122_Zanda_Protector_verge_half_tile_black_left",
          name: "Zanda_Protector_verge half tile black left",
          externalProductCode: "87035763",
          image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
          width: 15
        },
        halfRight: {
          code: "849702122_Zanda_Protector_verge_half_tile_black_right",
          name: "Zanda_Protector_verge half tile black right",
          externalProductCode: "87035764",
          image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
          width: 15
        }
      }
    ],
    valleyMetalFlushStart: {
      code: "669702122_Zanda_Protector_valley_metal_flush_black_start",
      name: "Zanda_Protector_valley metal flush black start",
      externalProductCode: "66035761",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      length: 19
    },
    valleyMetalFlush: {
      code: "669702122_Zanda_Protector_valley_metal_flush_black",
      name: "Zanda_Protector_valley metal flush black",
      externalProductCode: "66035762",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      length: 19
    },
    valleyMetalFlushEnd: {
      code: "669702122_Zanda_Protector_valley_metal_flush_black_end",
      name: "Zanda_Protector_valley metal flush black end",
      externalProductCode: "66035763",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      length: 19
    },
    valleyMetalFlushTop: {
      code: "669702122_Zanda_Protector_valley_metal_flush_black_top",
      name: "Zanda_Protector_valley metal flush black top",
      externalProductCode: "66035764",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      length: 19
    },
    valleyMetalFlushDormerStart: {
      code: "669702122_Zanda_Protector_valley_metal_flush_black_dormer_start",
      name: "Zanda_Protector_valley metal flush black dormer start",
      externalProductCode: "66035765",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      length: 19
    },
    accessories: [
      {
        code: "Other",
        name: "Other accesories example",
        externalProductCode: "5555550",
        image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
        category: "accessories"
      }
    ],
    eaveAccessories: [
      {
        code: "Fuglelist_ventilert",
        name: "Fuglelist ventilert",
        externalProductCode: "5555551",
        image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
        category: "accessories"
      }
    ],
    clip: {
      code: "clip",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      name: "Clips",
      externalProductCode: "113456781",
      category: "accessories"
    },
    ridgeAndHipScrew: {
      code: "ridgeAndHipScrew",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      name: "Ridge and Hip Screw",
      externalProductCode: "113456782",
      category: "accessories"
    },
    longScrew: {
      code: "longScrew",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      name: "Long Screw",
      externalProductCode: "113456783",
      category: "accessories"
    },
    screw: {
      code: "screw",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      name: "Screw",
      externalProductCode: "113456784",
      category: "accessories"
    },
    stormBracket: {
      code: "stormBracket",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      name: "Storm Bracket",
      externalProductCode: "113456785",
      category: "accessories"
    },
    finishingKit: {
      code: "finishingKit",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      name: "Finishing Kit",
      externalProductCode: "113456786",
      category: "accessories"
    },
    ventilationHoodOptions: [
      {
        code: "vho1",
        image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
        name: "Ventilation Hood 1",
        externalProductCode: "100456781",
        category: "ventilation"
      },
      {
        code: "vho2",
        image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
        name: "Ventilation Hood 2",
        externalProductCode: "100456782",
        category: "ventilation"
      }
    ],
    minBattenGauge: 31,
    maxBattenGauge: [
      {
        start: 15,
        end: 24,
        value: 31
      },
      {
        start: 24,
        end: 27,
        value: 33
      },
      {
        start: 27,
        end: 31,
        value: 34
      },
      {
        start: 31,
        end: 35,
        value: 35
      },
      {
        start: 35,
        end: 42,
        value: 36
      },
      {
        start: 42,
        end: 90,
        value: 37
      }
    ],
    eaveGauge: [
      {
        start: 15,
        end: 31,
        value: 38
      },
      {
        start: 31,
        end: 45,
        value: 38.5
      }
    ],
    ridgeSpacing: [
      {
        start: 15,
        end: 55,
        value: 5
      }
    ],
    width: 33.2,
    height: 42,
    brokenBond: true
  } as any,
  tileOptions: {
    verge: "Verge Metal Flush",
    ridge: "46035761",
    ventilation: ["100456781"]
  } as any,
  underlay: {
    underlay: "26583450"
  } as any,
  guttering: {
    guttering: "Test Guttering",
    gutteringVariant: "4391",
    gutteringHook: "4392",
    downPipes: 2,
    downPipeConnectors: 3
  } as any,
  underlays: data.underlays as any,
  gutters: data.gutters as any,
  gutterHooks: data.gutterHooks as any
};

describe("PitchedRoofCalculator Results component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <MicroCopy.Provider values={en}>
        <Results {...resultsProps} sendEmailAddress={jest.fn()} />
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with debugging mode on", () => {
    const { container } = render(
      <MicroCopy.Provider values={en}>
        <Results {...resultsProps} sendEmailAddress={jest.fn()} isDebugging />
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with no guttering", () => {
    const { container } = render(
      <MicroCopy.Provider values={en}>
        <Results
          {...{ ...resultsProps, guttering: {} }}
          sendEmailAddress={jest.fn()}
        />
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with main tile as verge", () => {
    const { container } = render(
      <MicroCopy.Provider values={en}>
        <Results
          {...{
            ...resultsProps,
            tileOptions: { ...resultsProps.tileOptions, verge: "none" }
          }}
          sendEmailAddress={jest.fn()}
        />
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with default ridge", () => {
    const { container } = render(
      <MicroCopy.Provider values={en}>
        <Results
          {...{
            ...resultsProps,
            tileOptions: { ...resultsProps.tileOptions, ridge: null }
          }}
          sendEmailAddress={jest.fn()}
        />
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("sends email address and downloads PDF ignoring unavailable images", async () => {
    fetchMockJest.get(`893ed88a9339cf3c629e614a923f7c1c.jpg`, {
      body: "image-data....",
      status: 200,
      headers: {
        "Content-Type": "image/jpeg"
      }
    });

    fetchMockJest.get(`f4420511632ec8f82eb7b56aff3a072b.jpg`, {
      throws: new Error("Not found")
    });

    const sendEmailAddress = jest.fn();
    const { container } = render(
      <MicroCopy.Provider values={en}>
        <Results {...resultsProps} sendEmailAddress={sendEmailAddress} />
      </MicroCopy.Provider>
    );

    const nameInput = container.querySelector(`input[name="name"]`);
    fireEvent.change(nameInput!, { target: { value: "Test Test" } });

    const emailInput = container.querySelector(`input[name="email"]`);
    fireEvent.change(emailInput!, { target: { value: "test@test.test" } });

    const gdpr_1Input = container.querySelector(`input[name="gdpr_1"]`);
    fireEvent.click(gdpr_1Input!);

    const gdpr_2Input = container.querySelector(`input[name="gdpr_2"]`);
    fireEvent.click(gdpr_2Input!);

    const submitButton = container.querySelector<HTMLButtonElement>(`.submit`)!;
    fireEvent.click(submitButton!);

    expect(sendEmailAddress.mock.calls).toMatchSnapshot(
      "Email address details"
    );

    await waitFor(() => expect(submitButton["disabled"]).toEqual(false));

    expect(openPDF.mock.calls).toMatchSnapshot("PDF props");
  });
});
