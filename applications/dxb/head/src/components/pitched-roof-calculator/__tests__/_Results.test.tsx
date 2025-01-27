import TextField from "@bmi-digital/components/text-field";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import { mockResponses } from "@bmi-digital/fetch-mocks";
import { BLOCKS } from "@contentful/rich-text-types";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import fetchMockJest from "fetch-mock-jest";
import React, { useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import { useIsMobileDevice } from "../../../utils/useIsMobileDevice";
import Results, { ResultProps, replaceImageURLWithImage } from "../_Results";
import { MicroCopy } from "../helpers/microCopy";
import { Props } from "../subcomponents/quantity-table/QuantityTable";
import {
  Accessory,
  GutterHook,
  GutterVariant,
  LengthBasedProduct,
  ProductCategory,
  ResultsRow,
  Underlay,
  VentilationHood,
  WidthBasedProduct
} from "../types";
import createRichText from "../../../__tests__/helpers/RichTextHelper";
import { createProduct } from "./helpers/createProduct";
import en from "./samples/copy/en.json";
import { createTile } from "./helpers/createTile";

jest.mock("../../../utils/useIsMobileDevice", () => ({
  useIsMobileDevice: jest.fn().mockReturnValue(false)
}));

const openPdfMock = jest.fn();
const getBlobMock = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("../../FormSection", () => {
  const formSection = jest.requireActual("../../FormSection");

  const HubSpotFormMock = (props: {
    title: React.ReactNode;
    description: React.ReactNode;
    onSuccess: () => void;
    onFormReady?: (_: unknown, form: HTMLElement) => void;
  }) => {
    const ref = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
      // inserts content into iframe document
      ref.current!.contentDocument!.body.innerHTML = renderToString(<HSForm />);
      console.log(ref.current!.contentDocument!.body.innerHTML);
      props.onFormReady?.({}, ref.current!);
      // tracks submit event of iframe form
      // eslint-disable-next-line testing-library/no-node-access
      ref.current!.contentDocument!.querySelector("form")!.onsubmit =
        props.onSuccess;
    }, []);

    const HSForm = () => (
      <ThemeProvider>
        <div>
          {props.title}
          {props.description}
          <form>
            <TextField
              name="name"
              variant="outlined"
              isRequired
              placeholder="name"
              data-testid="hs-name"
            />
            <TextField
              name="email"
              variant="outlined"
              isRequired
              placeholder="email"
              data-testid="hs-email"
            />
            <div className="hs-file">
              <input type="file" name="file" />
            </div>
            <button id="submit-button" data-testid="hs-submit-button">
              Submit button
            </button>
          </form>
        </div>
      </ThemeProvider>
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
    <div>
      {props.rows.map((row) => (
        <div key={row.externalProductCode}>
          <div>{row.description}</div>
          <div aria-label={`Quantity for ${row.description}`}>
            {row.quantity}
          </div>
          <button
            aria-label={`Remove ${row.description}`}
            onClick={() => props.onDelete(row)}
          >
            Delete
          </button>
          <button
            aria-label={`Increase quantity of ${row.description}`}
            onClick={() => props.onChangeQuantity(row, row.quantity + 1)}
          >
            +
          </button>
          <button
            aria-label={`Decrease quantity of ${row.description}`}
            onClick={() => props.onChangeQuantity(row, row.quantity - 1)}
          >
            -
          </button>
        </div>
      ))}
    </div>
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

const selectedVerge = {
  ...createProduct({
    name: "Verge Metal Flush",
    externalProductCode: "12345"
  }),
  left: createProduct<WidthBasedProduct>({
    code: "849702122_Zanda_Protector_verge_metal_flush_black_left",
    name: "Zanda_Protector_verge metal flush black left",
    externalProductCode: "86035761",
    image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
    coverWidth: 10
  }),
  right: createProduct<WidthBasedProduct>({
    code: "849702122_Zanda_Protector_verge_metal_flush_black_right",
    name: "Zanda_Protector_verge metal flush black right",
    externalProductCode: "86035762",
    image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
    coverWidth: 10
  })
};

const selectedRidge = createProduct<LengthBasedProduct>({
  code: "249702122_Zanda_Protector_ridge_tile_black",
  name: "Zanda_Protector_ridge tile black",
  externalProductCode: "46035761",
  image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
  coverLength: 33.33
});

const selectedVentilationHood = createProduct<VentilationHood>({
  code: "vho1",
  image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
  name: "Ventilation Hood 1",
  externalProductCode: "100456781",
  category: "ventilation"
});

const resultsProps: ResultProps = {
  hubSpotFormId: "mock",
  setIsHubSpotFormAvailable: jest.fn(),
  isHubSpotFormAvailable: true,
  needHelpSection: {
    __typename: "TitleWithContent",
    title: "",
    name: "",
    content: createRichText({
      json: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: []
      }
    })
  },
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
  },
  variant: {
    ...createTile({
      code: "175200122_Zanda_Protector_main_tile_black",
      name: "Zanda Protector main tile black",
      externalProductCode: "46035712",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      color: "Black"
    }),
    halfTile: createProduct<WidthBasedProduct>({
      code: "275102122_Zanda_Protector_half_tile_black",
      name: "Zanda Protector half tile black",
      externalProductCode: "46035795",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      coverWidth: 18
    }),
    hip: createProduct<LengthBasedProduct>({
      code: "249702122_Zanda_Protector_ridge_tile_black",
      name: "Zanda_Protector_ridge tile black",
      externalProductCode: "46035761",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      coverLength: 33.33
    }),
    ridgeOptions: [
      selectedRidge,
      createProduct<LengthBasedProduct>({
        code: "249702122_Zanda_Protector_SAMPLE_RIDGE_METAL_FLUSH",
        name: "Zanda_Protector_ridge sample metal flush black",
        externalProductCode: "46035001",
        image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
        coverLength: 33.33
      })
    ],
    vergeOptions: [
      selectedVerge,
      {
        ...createProduct({ name: "Verge Tile" }),
        left: createProduct<WidthBasedProduct>({
          code: "849702122_Zanda_Protector_verge_tile_black_left",
          name: "Zanda_Protector_verge tile black left",
          externalProductCode: "87035761",
          image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
          coverWidth: 30
        }),
        right: createProduct<WidthBasedProduct>({
          code: "849702122_Zanda_Protector_verge_tile_black_right",
          name: "Zanda_Protector_verge tile black right",
          externalProductCode: "87035762",
          image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
          coverWidth: 30
        }),
        halfLeft: createProduct<WidthBasedProduct>({
          code: "849702122_Zanda_Protector_verge_half_tile_black_left",
          name: "Zanda_Protector_verge half tile black left",
          externalProductCode: "87035763",
          image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
          coverWidth: 15
        }),
        halfRight: createProduct<WidthBasedProduct>({
          code: "849702122_Zanda_Protector_verge_half_tile_black_right",
          name: "Zanda_Protector_verge half tile black right",
          externalProductCode: "87035764",
          image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
          coverWidth: 15
        })
      }
    ],

    valleyMetalFlushStart: createProduct<LengthBasedProduct>({
      code: "669702122_Zanda_Protector_valley_metal_flush_black_start",
      name: "Zanda_Protector_valley metal flush black start",
      externalProductCode: "66035761",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      coverLength: 19
    }),
    valleyMetalFlush: createProduct<LengthBasedProduct>({
      code: "669702122_Zanda_Protector_valley_metal_flush_black",
      name: "Zanda_Protector_valley metal flush black",
      externalProductCode: "66035762",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      coverLength: 19
    }),
    valleyMetalFlushEnd: createProduct<LengthBasedProduct>({
      code: "669702122_Zanda_Protector_valley_metal_flush_black_end",
      name: "Zanda_Protector_valley metal flush black end",
      externalProductCode: "66035763",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      coverLength: 19
    }),
    valleyMetalFlushTop: createProduct<LengthBasedProduct>({
      code: "669702122_Zanda_Protector_valley_metal_flush_black_top",
      name: "Zanda_Protector_valley metal flush black top",
      externalProductCode: "66035764",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      coverLength: 19
    }),
    valleyMetalFlushDormerStart: createProduct<LengthBasedProduct>({
      code: "669702122_Zanda_Protector_valley_metal_flush_black_dormer_start",
      name: "Zanda_Protector_valley metal flush black dormer start",
      externalProductCode: "66035765",
      image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
      coverLength: 19
    }),
    accessories: [
      createProduct<Accessory>({
        code: "Other",
        name: "Other accesories example",
        externalProductCode: "5555550",
        image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
        category: ProductCategory.Accessories
      }),
      createProduct<Accessory>({
        code: "304200051_M_Glue_290ml_grey",
        name: "M_Glue_290ml",
        externalProductCode: "51531703",
        image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
        category: ProductCategory.Sealing,
        packSize: 1
      })
    ],
    eaveAccessories: [
      createProduct<Accessory>({
        code: "Fuglelist_ventilert",
        name: "Fuglelist ventilert",
        externalProductCode: "5555551",
        image: "893ed88a9339cf3c629e614a923f7c1c.jpg",
        category: ProductCategory.Accessories
      })
    ],
    clip: createProduct<Accessory>({
      code: "clip",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      name: "Clips",
      externalProductCode: "113456781",
      category: ProductCategory.Fixings
    }),
    ridgeAndHipScrew: createProduct<Accessory>({
      code: "ridgeAndHipScrew",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      name: "Ridge and Hip Screw",
      externalProductCode: "113456782",
      category: ProductCategory.Fixings
    }),
    longScrew: createProduct<Accessory>({
      code: "longScrew",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      name: "Long Screw",
      externalProductCode: "113456783",
      category: ProductCategory.Fixings
    }),
    screw: createProduct<Accessory>({
      code: "screw",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      name: "Screw",
      externalProductCode: "113456784",
      category: ProductCategory.Fixings
    }),
    stormBracket: createProduct<Accessory>({
      code: "stormBracket",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      name: "Storm Bracket",
      externalProductCode: "113456785",
      category: ProductCategory.Accessories
    }),
    finishingKit: createProduct<Accessory>({
      code: "finishingKit",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      name: "Finishing Kit",
      externalProductCode: "113456786",
      category: ProductCategory.Accessories
    }),
    ventilationHoodOptions: [
      selectedVentilationHood,
      createProduct<VentilationHood>({
        code: "vho2",
        image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
        name: "Ventilation Hood 2",
        externalProductCode: "100456782",
        category: "ventilation"
      })
    ],
    minBattenSpacing: 31,
    battenSpacings: [
      {
        minAngle: 1,
        maxAngle: 90,
        battenDistance: {
          value: 340,
          unit: "mm"
        },
        firstRowBattenDistance: {
          value: 380,
          unit: "mm"
        }
      }
    ],
    ridgeSpacing: 5,
    coverWidth: 33.2,
    length: 42,
    brokenBond: true
  },
  tileOptions: {
    verge: selectedVerge,
    ridge: selectedRidge,
    ventilationHoods: [selectedVentilationHood]
  },
  underlay: createProduct<Underlay>({
    code: "304910308_Underlay_Divoroll_TOP_RU",
    name: "Underlay Divoroll TOP RU",
    description: "Short underlay description",
    externalProductCode: "26583450",
    image:
      "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h02/hc4/8975281455134/Product-Hero-Small-Desktop-Tablet-44134232-Icopal-Takshingel-type-S-Teglrod-med-skyggejpg",
    length: 5000,
    width: 150,
    overlap: 0
  }),
  guttering: {
    guttering: "test_guttering",
    gutteringVariant: createProduct<GutterVariant>({
      code: "Test_Guttering_Grey",
      name: "Test Guttering Grey",
      externalProductCode: "4391",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      length: 600,
      downPipe: createProduct<Accessory>({
        code: "Downpipe",
        name: "Downpipe",
        image:
          "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/hc6/h4b/8975279292446/Product-Hero-Small-Desktop-Tablet-44134213-Icopal-Takshingel-type-S-Skiferjpg",
        externalProductCode: "33332",
        category: ProductCategory.Accessories
      }),
      downPipeConnector: createProduct<Accessory>({
        code: "Downpipe_Connector",
        name: "Downpipe Connector",
        image:
          "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/hc6/h4b/8975279292446/Product-Hero-Small-Desktop-Tablet-44134213-Icopal-Takshingel-type-S-Skiferjpg",
        externalProductCode: "33331",
        category: ProductCategory.Accessories
      })
    }),
    gutteringHook: createProduct<GutterHook>({
      code: "Test_Guttering_Hook_Grey",
      name: "Test Guttering Hook Grey",
      externalProductCode: "4392",
      image: "f4420511632ec8f82eb7b56aff3a072b.jpg",
      length: 400
    }),
    downPipes: 2,
    downPipeConnectors: 3
  }
};

describe("PitchedRoofCalculator Results component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results {...resultsProps} />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with debugging mode on", () => {
    const { container } = render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results {...resultsProps} isDebugging />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with no guttering", () => {
    const { container } = render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results {...{ ...resultsProps, guttering: undefined }} />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with main tile as verge", () => {
    const { container } = render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results
            {...{
              ...resultsProps,
              tileOptions: { ...resultsProps.tileOptions, verge: "none" }
            }}
          />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with default ridge", () => {
    const { container } = render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results
            {...{
              ...resultsProps,
              tileOptions: { ...resultsProps.tileOptions, verge: "none" }
            }}
          />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("opens PDF report", async () => {
    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results {...resultsProps} />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    const hsForm = screen.getByTitle<HTMLIFrameElement>("HubSpot Form");
    const emailInput =
      // eslint-disable-next-line testing-library/no-node-access -- screen can't access iframe contents for some reason
      hsForm.contentDocument!.querySelector("input[name=email]");
    fireEvent.change(emailInput!, { target: { value: "test@test.test" } });

    // eslint-disable-next-line testing-library/no-node-access -- screen can't access iframe contents for some reason
    const nameInput = hsForm.contentDocument!.querySelector("input[name=name]");
    fireEvent.change(nameInput!, { target: { value: "Test Name" } });

    // eslint-disable-next-line testing-library/no-node-access -- screen can't access iframe contents for some reason
    fireEvent.click(hsForm.contentDocument!.getElementById("submit-button")!);
    await waitFor(() => expect(openPdfMock).toHaveBeenCalledTimes(1));
  });

  it("inserts PDF report into form", async () => {
    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results {...resultsProps} />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    await waitFor(() => expect(getBlobMock).toHaveBeenCalledTimes(1));
  });

  it("renders with final report", () => {
    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results {...resultsProps} />
        </MicroCopy.Provider>
      </ThemeProvider>
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

  it("Moves product to 'extra section' when user tries to delete it", () => {
    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results {...resultsProps} />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(
      screen.queryByText("MC: results.edited.products.title")
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByLabelText(`Remove ${resultsProps.variant.clip!.name}`)
    );
    expect(
      screen.getByText("MC: results.edited.products.title")
    ).toBeInTheDocument();
  });

  it("Moves product to 'extra section' and change quantity if user clicks on '+' button", async () => {
    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results {...resultsProps} />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    const quantityNode = screen.getByLabelText(
      `Quantity for ${resultsProps.variant.clip!.name}`
    );
    const initialQuantity = Number(quantityNode.textContent);

    fireEvent.click(
      screen.getByLabelText(
        `Increase quantity of ${resultsProps.variant.clip!.name}`
      )
    );
    expect(
      screen.getByText("MC: results.edited.products.title")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByLabelText(
        `Increase quantity of ${resultsProps.variant.clip!.name}`
      )
    );
    expect(
      Number(
        screen.getByLabelText(`Quantity for ${resultsProps.variant.clip!.name}`)
          .textContent
      )
    ).toBe(initialQuantity + 2);
  });

  it("Removes product if user removes it from 'extra section'", () => {
    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results {...resultsProps} />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    fireEvent.click(
      screen.getByLabelText(`Remove ${resultsProps.variant.clip!.name}`)
    );
    expect(
      screen.getByText(resultsProps.variant.clip!.name)
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByLabelText(`Remove ${resultsProps.variant.clip!.name}`)
    );
    expect(
      screen.queryByText(resultsProps.variant.clip!.name)
    ).not.toBeInTheDocument();
  });

  it("resets products and removes 'extra section'", () => {
    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results {...resultsProps} />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    fireEvent.click(
      screen.getByLabelText(`Remove ${resultsProps.variant.clip!.name}`)
    );

    fireEvent.click(
      screen.getByText("MC: results.alerts.quantities.reset.button")
    );
    expect(
      screen.queryByText("MC: results.edited.products.title")
    ).not.toBeInTheDocument();
  });

  it("renders correctly without HubSpot form", () => {
    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results {...resultsProps} isHubSpotFormAvailable={false} />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(
      screen.getByText("MC: results.download.pdf.help")
    ).toBeInTheDocument();
  });

  it("renders need help section with title", async () => {
    const title = "Need help title";
    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results
            {...resultsProps}
            isHubSpotFormAvailable={false}
            needHelpSection={{ ...resultsProps.needHelpSection, title }}
          />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("opens report correctly for mobile devices", async () => {
    (useIsMobileDevice as jest.MockedFn<() => boolean>).mockReturnValue(true);

    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results {...resultsProps} isHubSpotFormAvailable={false} />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText("MC: results.downloadPdfLabel"));
    await waitFor(() => expect(openPdfMock).toBeCalledWith("", window));
  });

  it("renders correctly without ventilationHood and verge tile", () => {
    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <Results
            {...resultsProps}
            tileOptions={{
              ...resultsProps.tileOptions,
              ventilationHoods: "none",
              verge: "none"
            }}
          />
        </MicroCopy.Provider>
      </ThemeProvider>
    );
    expect(
      screen.queryByText("MC: results.categories.ventilation")
    ).not.toBeInTheDocument();
  });
});

describe("replaceImageURLWithImage", () => {
  const fetchMock = fetchMockJest.sandbox();
  global.fetch = fetchMock as typeof fetch;

  beforeEach(() => {
    fetchMock.reset();
  });

  it("removes image if that's not jpeg or png", async () => {
    const data: ResultsRow = {
      category: ProductCategory.Accessories,
      image: "mockImage.gif",
      description: "",
      externalProductCode: "",
      packSize: "10",
      quantity: 10
    };

    mockResponses(fetchMock, {
      headers: { "content-type": "image/gif" },
      url: "*",
      method: "GET",
      status: 200
    });

    const res = await replaceImageURLWithImage(data);
    expect(res.image).toBeNull();
  });

  it("transforms image into base64", async () => {
    const data: ResultsRow = {
      category: ProductCategory.Accessories,
      image: "mockImage.jpeg",
      description: "",
      externalProductCode: "",
      packSize: "10",
      quantity: 10
    };

    mockResponses(fetchMock, {
      headers: { "content-type": "image/jpeg" },
      url: "*",
      method: "GET",
      status: 200,
      body: new File(["mock"], "mock.jpeg", { type: "image/jpeg" })
    });

    const res = await replaceImageURLWithImage(data);
    expect(res.image!.includes("data:image/jpeg;base64")).toBeTruthy();
  });
});
