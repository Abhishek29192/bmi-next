import { TextField } from "@bmi/components";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import React, { useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import { MicroCopy } from "../../helpers/microCopy";
import en from "../../samples/copy/en.json";
import data from "../../samples/data.json";
import { Measurements } from "../../types/roof";
import { Props } from "../subcomponents/quantity-table/QuantityTable";
import Results from "../_Results";

beforeAll(() => {
  mockConsole();
});

const openPdfMock = jest.fn();
const getBlobMock = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("../../../FormSection", () => {
  const formSection = jest.requireActual("../../../FormSection");

  const HubSpotFormMock = (props: {
    title: React.ReactNode;
    description: React.ReactNode;
    onSuccess: () => void;
    onFormReady?: (_, form: HTMLElement) => void;
  }) => {
    const ref = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
      // inserts content into iframe document
      ref.current.contentDocument.body.innerHTML = renderToString(<HSForm />);
      props.onFormReady?.({}, ref.current);
      // tracks submit event of iframe form
      ref.current.contentDocument.querySelector("form").onsubmit =
        props.onSuccess;
    }, []);

    const HSForm = () => (
      <div>
        {props.title}
        {props.description}
        <form>
          <TextField
            name="name"
            variant="outlined"
            isRequired
            placeholder="name"
          />
          <TextField
            name="email"
            variant="outlined"
            isRequired
            placeholder="email"
          />
          <div className="hs-file">
            <input type="file" name="file" />
          </div>
          <button id="submit-button">Submit button</button>
        </form>
      </div>
    );

    return <iframe ref={ref} title="HubSpot Form" />;
  };

  return {
    __esModule: true,
    ...formSection,
    default: HubSpotFormMock
  };
});

jest.mock("../subcomponents/quantity-table/QuantityTable", () => {
  const QuantityTable = (props: Props) => (
    <p>{JSON.stringify(props, null, 2)}</p>
  );

  return {
    __esModule: true,
    default: QuantityTable
  };
});

jest.mock("../_PDF", () => ({
  __esModule: true,
  default: jest.fn(),
  createPdf: () => ({
    getBlob: getBlobMock,
    open: openPdfMock
  })
}));

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
      },
      {
        code: "306222100_Storm_clips_55_Zanda_Minster",
        name: "Storm_clips_55_Zanda_Minster",
        externalProductCode: "21282017",
        image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
        category: "fixings",
        packSize: 125
      },
      {
        code: "304200051_M_Glue_290ml_grey",
        name: "M_Glue_290ml",
        externalProductCode: "51531703",
        image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
        category: "sealing",
        packSize: 1
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
  underlay: data.underlays[0],
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
  it("renders with debugging mode on", () => {
    const { container } = render(
      <MicroCopy.Provider values={en}>
        <Results {...resultsProps} isDebugging />
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with no guttering", () => {
    const { container } = render(
      <MicroCopy.Provider values={en}>
        <Results {...{ ...resultsProps, guttering: {} }} />
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
        />
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("opens PDF report", async () => {
    render(
      <MicroCopy.Provider values={en}>
        <Results {...resultsProps} />
      </MicroCopy.Provider>
    );

    const hsForm = screen.getByTitle<HTMLIFrameElement>("HubSpot Form");
    const emailInput =
      hsForm.contentDocument.querySelector("input[name=email]");
    fireEvent.change(emailInput, { target: { value: "test@test.test" } });

    const nameInput = hsForm.contentDocument.querySelector("input[name=name]");
    fireEvent.change(nameInput, { target: { value: "Test Name" } });

    fireEvent.click(hsForm.contentDocument.getElementById("submit-button"));
    waitFor(() => expect(openPdfMock).toHaveBeenCalledTimes(1));
  });

  it("inserts PDF report into form", () => {
    render(
      <MicroCopy.Provider values={en}>
        <Results {...resultsProps} />
      </MicroCopy.Provider>
    );

    waitFor(() => expect(getBlobMock).toBeCalledTimes(1));
  });

  it("renders without final report if ridgeOptions are empty", () => {
    render(
      <MicroCopy.Provider values={en}>
        <Results
          {...resultsProps}
          variant={{ ...resultsProps.variant, ridgeOptions: [] }}
        />
      </MicroCopy.Provider>
    );

    expect(
      screen.queryByText("MC: results.categories.tiles")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("MC: results.categories.fixings")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("MC: results.categories.sealing")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("MC: results.categories.ventilation")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("MC: results.categories.accessories")
    ).not.toBeInTheDocument();
  });

  it("renders without final report if underlay is empty", () => {
    render(
      <MicroCopy.Provider values={en}>
        <Results {...resultsProps} underlays={[]} />
      </MicroCopy.Provider>
    );

    expect(
      screen.queryByText("MC: results.categories.tiles")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("MC: results.categories.fixings")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("MC: results.categories.sealing")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("MC: results.categories.ventilation")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("MC: results.categories.accessories")
    ).not.toBeInTheDocument();
  });

  it("renders with final report", () => {
    render(
      <MicroCopy.Provider values={en}>
        <Results {...resultsProps} />
      </MicroCopy.Provider>
    );

    expect(
      screen.getByText("MC: results.categories.tiles")
    ).toBeInTheDocument();
    expect(
      screen.getByText("MC: results.categories.fixings")
    ).toBeInTheDocument();
    expect(
      screen.getByText("MC: results.categories.sealing")
    ).toBeInTheDocument();
    expect(
      screen.getByText("MC: results.categories.ventilation")
    ).toBeInTheDocument();
    expect(
      screen.getByText("MC: results.categories.accessories")
    ).toBeInTheDocument();
  });
});
