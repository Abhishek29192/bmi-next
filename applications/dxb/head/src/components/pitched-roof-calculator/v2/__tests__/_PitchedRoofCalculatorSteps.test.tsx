import { createProduct as createESProduct } from "@bmi/elasticsearch-types";
import { act, render, waitFor } from "@testing-library/react";
import React from "react";
import * as elasticSearch from "../../../../utils/elasticSearch";
import { MicroCopy } from "../../helpers/microCopy";
import { transformClassificationAttributes } from "../../helpers/products";
import en from "../../samples/copy/en.json";
import { CalculatorSteps } from "../../types";
import { ProductType, RidgeOption, VentilationHood } from "../../types/v2";
import roofs from "../calculation/roofs";
import {
  Props as CalculatorStepperProps,
  StepProps
} from "../subcomponents/calculator-stepper/CalculatorStepper";
import { GutteringProps } from "../_Guttering";
import PitchedRoofCalculatorSteps from "../_PitchedRoofCalculatorSteps";
import { ResultProps } from "../_Results";
import { RoofDimensionsProps } from "../_RoofDimensions";
import { RoofSelectionProps } from "../_RoofSelection";
import { TileOptionsProps } from "../_TileOptions";
import { TileSelectionProps } from "../_TileSelection";
import { UnderlaySelectionProps } from "../_UnderlaySelection";
import { VariantSelectionProps } from "../_VariantSelection";

const dimensions = {
  A: "9",
  B: "15",
  P: "22",
  protrusions: []
};

const tRidge = createESProduct({
  code: "t-ridge",
  name: "T-ridge",
  externalProductCode: "43232132",
  MEASUREMENTS$LENGTH: [
    {
      code: "30cm",
      name: "30 cm",
      value: "30"
    }
  ]
});

const ridgeTile = createESProduct({
  code: "Ridge_tile",
  name: "Ridge tile",
  externalProductCode: "46035761",
  MEASUREMENTS$LENGTH: [
    {
      code: "30cm",
      name: "30 cm",
      value: "30"
    }
  ],
  productReferences: [{ type: "T_RIDGE", code: tRidge.code }]
});

const rightVergeTile = createESProduct({
  code: "right_verge_tile",
  name: "Right verge tile",
  externalProductCode: "43232132"
});

const leftVergeTile = createESProduct({
  code: "left_verge_tile",
  name: "Left verge tile",
  externalProductCode: "342543412"
});

const ventilationHood = createESProduct({
  code: "ventilation_hood",
  name: "Ventilation Hood",
  externalProductCode: "100456781",
  category: "ventilation"
});

const tile = createESProduct({
  name: "tile",
  externalProductCode: "tile_product_code",
  productReferences: [
    { type: "RIDGE_TILE", code: ridgeTile.code },
    { type: "VENTILATION_HOOD", code: ventilationHood.code },
    { type: "LEFT_VERGE_TILE", code: leftVergeTile.code },
    { type: "RIGHT_VERGE_TILE", code: rightVergeTile.code }
  ],
  APPEARANCEATTRIBUTES$COLOUR: [{ name: "Red", code: "Red" }],
  GENERALINFORMATION$CLASSIFICATION: [{ name: "metal", code: "metal" }],
  TILESATTRIBUTES$BROKENBOND: [{ name: false, code: false }],
  MEASUREMENTS$WIDTH: [
    {
      code: "330mm",
      name: "330 mm",
      value: "330"
    }
  ],
  MEASUREMENTS$LENGTH: [
    {
      code: "44cm",
      name: "440 cm",
      value: "440"
    }
  ],
  TILESATTRIBUTES$MINIMUMBATTENSPACING: [
    {
      code: "100",
      name: "100",
      value: "100"
    }
  ],
  TILESATTRIBUTES$MAXIMUMBATTENSPACING: [
    {
      code: "200",
      name: "200",
      value: 200
    }
  ],
  TILESATTRIBUTES$RIDGESPACE: [
    {
      code: "10cm",
      name: "10 cm",
      value: "10"
    }
  ],
  TILESATTRIBUTES$EAVEGAUGE: [
    {
      code: "24cm",
      name: "24 cm",
      value: "24"
    }
  ],
  GENERALINFORMATION$PRODUCTTYPE: [
    {
      code: ProductType.tile,
      name: "Main Tile"
    }
  ],
  baseProduct: {
    code: "tile_base_product_code",
    name: "Tile base product name"
  }
});

const underlay = createESProduct({
  name: "Underlay",
  externalProductCode: "underlay_product_code",
  MEASUREMENTS$LENGTH: [
    {
      code: "600cm",
      name: "600 cm",
      value: "600"
    }
  ],
  MEASUREMENTS$WIDTH: [
    {
      code: "50cm",
      name: "50 cm",
      value: "50"
    }
  ],
  GENERALINFORMATION$PRODUCTTYPE: [
    {
      code: ProductType.underlay,
      name: "Underlay"
    }
  ],
  UNDERLAYATTRIBUTES$OVERLAP: [
    {
      code: "5cm",
      name: "5 cm",
      value: "5"
    }
  ]
});

const gutter = createESProduct({
  name: "Gutter",
  externalProductCode: "gutter_product_code",
  MEASUREMENTS$LENGTH: [
    {
      code: "600",
      name: "600",
      value: "600"
    }
  ],
  GENERALINFORMATION$PRODUCTTYPE: [
    {
      code: ProductType.gutter,
      name: "Gutter"
    }
  ],
  baseProduct: {
    code: "underlay_base_product_code",
    name: "Underlay base product"
  }
});

const gutterHook = createESProduct({
  name: "Gutter Hook",
  externalProductCode: "gutter_hook_product_code",
  MEASUREMENTS$LENGTH: [
    {
      code: "30",
      name: "30",
      value: "30"
    }
  ],
  GENERALINFORMATION$PRODUCTTYPE: [
    {
      code: ProductType.gutterHook,
      name: "Gutter Hook"
    }
  ]
});

const variant = {
  ...transformClassificationAttributes([tile], ProductType.tile)[0],
  packSize: 1,
  ridgeOptions: transformClassificationAttributes([ridgeTile]) as RidgeOption[],
  ventilationHoodOptions: transformClassificationAttributes([
    ridgeTile
  ]) as VentilationHood[],
  vergeOption: {
    left: transformClassificationAttributes([leftVergeTile])[0],
    right: transformClassificationAttributes([rightVergeTile])[0]
  }
};

const mainProducts = [
  { _source: tile },
  { _source: underlay },
  { _source: gutter },
  { _source: gutterHook }
];

const nestedProducts = [
  { _source: ridgeTile },
  { _source: ventilationHood },
  { _source: leftVergeTile },
  { _source: rightVergeTile }
];

let selected = CalculatorSteps.SelectRoof;
const setSelected = jest
  .fn()
  .mockImplementation(
    (selection: CalculatorSteps.SelectRoof) => (selected = selection)
  );

let componentProps: {
  _RoofSelection?: RoofSelectionProps;
  _RoofDimensions?: RoofDimensionsProps;
  _TileSelection?: TileSelectionProps;
  _TileOptions?: TileOptionsProps;
  _VariantSelection?: VariantSelectionProps;
  _UnderlaySelection?: UnderlaySelectionProps;
  _Guttering?: GutteringProps;
  _Results?: ResultProps;
} = {};
jest.mock("../_RoofSelection", () => {
  const RoofSelection = (props: RoofSelectionProps) => {
    componentProps["_RoofSelection"] = props;
    return <p>Rendering _RoofSelection</p>;
  };
  return {
    __esModule: true,
    default: RoofSelection
  };
});
jest.mock("../_RoofDimensions", () => {
  const RoofDimensions = (props: RoofDimensionsProps) => {
    componentProps["_RoofDimensions"] = props;
    return <p>Rendering _RoofDimensions</p>;
  };
  return {
    __esModule: true,
    default: RoofDimensions
  };
});
jest.mock("../_TileSelection", () => {
  const TileSelection = (props: TileSelectionProps) => {
    componentProps["_TileSelection"] = props;
    return <p>Rendering _TileSelection</p>;
  };
  return {
    __esModule: true,
    default: TileSelection
  };
});
jest.mock("../_TileOptions", () => {
  const TileOptions = (props: TileOptionsProps) => {
    componentProps["_TileOptions"] = props;
    return <p>Rendering _TileOptions</p>;
  };
  return {
    __esModule: true,
    default: TileOptions
  };
});
jest.mock("../_VariantSelection", () => {
  const VariantSelection = (props: VariantSelectionProps) => {
    componentProps["_VariantSelection"] = props;
    return <p>Rendering _VariantSelection</p>;
  };
  return {
    __esModule: true,
    default: VariantSelection
  };
});
jest.mock("../_UnderlaySelection", () => {
  const UnderlaySelection = (props: UnderlaySelectionProps) => {
    componentProps["_UnderlaySelection"] = props;
    return <p>Rendering _UnderlaySelection</p>;
  };
  return {
    __esModule: true,
    default: UnderlaySelection
  };
});
jest.mock("../_Guttering", () => {
  const Guttering = (props: GutteringProps) => {
    componentProps["_Guttering"] = props;
    return <p>Rendering _Guttering</p>;
  };
  return {
    __esModule: true,
    default: Guttering
  };
});
jest.mock("../_Results", () => {
  const Results = (props: ResultProps) => {
    componentProps["_Results"] = props;
    return <p>Rendering _Results</p>;
  };
  return {
    __esModule: true,
    default: Results
  };
});

let renderedStep: string;
const stepProps: Record<string, StepProps> = {};
jest.mock(`../subcomponents/calculator-stepper/CalculatorStepper`, () => {
  const CalculatorStepper = ({
    selected,
    children
  }: CalculatorStepperProps) => {
    renderedStep = selected;
    return React.Children.toArray(children)
      .filter((item): item is React.ReactElement => {
        const key =
          (typeof item !== "string" &&
            typeof item !== "number" &&
            "key" in item &&
            item.key) ||
          "";
        return `${key}`.substr(2) === selected;
      })
      .map((element: React.ReactElement) =>
        React.cloneElement(element, {
          passedKey: `${element.key}`.substr(2)
        })
      );
  };

  CalculatorStepper.Step = jest.fn().mockImplementation((props) => {
    stepProps[props.passedKey] = props;
    return (
      <div>
        <p>Step {props.passedKey}</p>
        {props.children}
      </div>
    );
  });

  return {
    __esModule: true,
    default: CalculatorStepper
  };
});

let mockedES: jest.SpyInstance | undefined;
beforeEach(() => {
  componentProps = {};
  selected = CalculatorSteps.SelectRoof;
});

afterEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  mockedES?.mockRestore();
});

describe("PitchedRoofCalculatorSteps component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <MicroCopy.Provider values={en}>
        <PitchedRoofCalculatorSteps
          selected={CalculatorSteps.SelectRoof}
          setSelected={jest.fn()}
          calculatorConfig={null}
        />
      </MicroCopy.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("moves through the steps", async () => {
    mockedES = jest
      .spyOn(elasticSearch, "queryElasticSearch")
      .mockResolvedValueOnce({ hits: { hits: mainProducts } })
      .mockResolvedValueOnce({ hits: { hits: nestedProducts } })
      .mockResolvedValueOnce({ hits: { hits: [{ _source: tRidge }] } });

    const getComponent = (selected: CalculatorSteps) => (
      <MicroCopy.Provider values={en}>
        <PitchedRoofCalculatorSteps
          selected={selected}
          setSelected={setSelected}
          calculatorConfig={{
            hubSpotFormId: "mock",
            roofShapes: [{ roofShapeId: "1" }, { roofShapeId: "2" }],
            needHelpSection: {
              __typename: "ContentfulTitleWithContent",
              title: "",
              name: "",
              content: { raw: "", references: [] }
            }
          }}
        />
      </MicroCopy.Provider>
    );

    const { rerender, debug } = render(getComponent(selected));

    debug();

    expect(renderedStep).toBe(CalculatorSteps.SelectRoof);

    stepProps[CalculatorSteps.SelectRoof].nextButtonOnClick(createFormEvent(), {
      roof: roofs[0].id
    });
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.EnterDimensions);

    act(() =>
      stepProps[CalculatorSteps.EnterDimensions].nextButtonOnClick(
        createFormEvent(),
        dimensions
      )
    );
    rerender(getComponent(selected));
    await waitFor(() => expect(renderedStep).toBe(CalculatorSteps.SelectTile));

    stepProps[CalculatorSteps.SelectTile].nextButtonOnClick(createFormEvent(), {
      tile: tile.baseProduct.code
    });
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.SelectVariant);

    stepProps[CalculatorSteps.SelectVariant].nextButtonOnClick(
      createFormEvent(),
      { variant: variant.externalProductCode }
    );
    await waitFor(() => expect(selected).toBe(CalculatorSteps.TileOptions));
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.TileOptions);

    act(() =>
      stepProps[CalculatorSteps.TileOptions].nextButtonOnClick(
        createFormEvent(),
        {
          verge: leftVergeTile.externalProductCode,
          ridge: ridgeTile.externalProductCode,
          ventilation: [ventilationHood.externalProductCode]
        }
      )
    );
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.SelectUnderlay);

    act(() =>
      stepProps[CalculatorSteps.SelectUnderlay].nextButtonOnClick(
        createFormEvent(),
        {
          underlay: underlay.externalProductCode
        }
      )
    );
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.Guttering);

    act(() => stepProps[CalculatorSteps.Guttering].linkOnClick());
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.YourSolutionContains);

    act(() =>
      stepProps[CalculatorSteps.YourSolutionContains].backButtonOnClick()
    );
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.Guttering);

    act(() =>
      stepProps[CalculatorSteps.Guttering].nextButtonOnClick(
        createFormEvent(),
        {
          guttering: gutter.baseProduct.code,
          gutteringVariant: gutter.externalProductCode,
          gutteringHook: gutterHook.externalProductCode,
          downPipes: 10,
          downPipeConnectors: 15
        }
      )
    );
    await waitFor(() =>
      expect(selected).toBe(CalculatorSteps.YourSolutionContains)
    );
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.YourSolutionContains);

    [
      [CalculatorSteps.YourSolutionContains, CalculatorSteps.Guttering],
      [CalculatorSteps.Guttering, CalculatorSteps.SelectUnderlay],
      [CalculatorSteps.SelectUnderlay, CalculatorSteps.TileOptions],
      [CalculatorSteps.TileOptions, CalculatorSteps.SelectVariant],
      [CalculatorSteps.SelectVariant, CalculatorSteps.SelectTile],
      [CalculatorSteps.SelectTile, CalculatorSteps.EnterDimensions],
      [CalculatorSteps.EnterDimensions, CalculatorSteps.SelectRoof]
    ].forEach(([current, previous]) => {
      // eslint-disable-next-line security/detect-object-injection
      act(() => stepProps[current].backButtonOnClick());
      rerender(getComponent(selected));
      expect(renderedStep).toBe(previous);
    });
  });

  it("moves to the first step from the last step", async () => {
    selected = CalculatorSteps.YourSolutionContains;
    const getComponent = (selected: CalculatorSteps) => (
      <MicroCopy.Provider values={en}>
        <PitchedRoofCalculatorSteps
          selected={selected}
          setSelected={setSelected}
          calculatorConfig={{
            hubSpotFormId: "mock",
            roofShapes: [{ roofShapeId: "1" }, { roofShapeId: "2" }],
            needHelpSection: {
              __typename: "ContentfulTitleWithContent",
              title: "",
              name: "",
              content: { raw: "", references: [] }
            }
          }}
        />
      </MicroCopy.Provider>
    );

    const { rerender } = render(getComponent(selected));
    stepProps[CalculatorSteps.YourSolutionContains].linkOnClick();

    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.SelectRoof);
  });

  it("allows to skip tile and tile options selection steps if there is no tile", () => {
    jest
      .spyOn(elasticSearch, "queryElasticSearch")
      .mockResolvedValueOnce({ hits: { hits: [] } });

    const getComponent = (selected: CalculatorSteps) => (
      <MicroCopy.Provider values={en}>
        <PitchedRoofCalculatorSteps
          selected={selected}
          setSelected={setSelected}
          calculatorConfig={null}
        />
      </MicroCopy.Provider>
    );
    const { rerender } = render(getComponent(selected));

    stepProps[CalculatorSteps.SelectRoof].nextButtonOnClick(createFormEvent(), {
      roof: roofs[0].id
    });
    rerender(getComponent(selected));

    stepProps[CalculatorSteps.EnterDimensions].nextButtonOnClick(
      createFormEvent(),
      dimensions
    );
    rerender(getComponent(selected));

    expect(selected).toBe(CalculatorSteps.SelectTile);
    stepProps[CalculatorSteps.SelectTile].nextButtonOnClick(createFormEvent(), {
      tile: undefined
    });
    rerender(getComponent(selected));

    stepProps[CalculatorSteps.SelectVariant].nextButtonOnClick(
      createFormEvent(),
      { variant: undefined }
    );
    rerender(getComponent(selected));
    expect(selected).toBe(CalculatorSteps.TileOptions);

    stepProps[CalculatorSteps.TileOptions].nextButtonOnClick(
      createFormEvent(),
      { verge: undefined, ridge: undefined, ventilation: [] }
    );
    rerender(getComponent(selected));
    expect(selected).toBe(CalculatorSteps.SelectUnderlay);
  });

  it("shouldn't send second request if user selects the same tile twice", async () => {
    mockedES = jest
      .spyOn(elasticSearch, "queryElasticSearch")
      .mockResolvedValueOnce({ hits: { hits: mainProducts } })
      .mockResolvedValue({ hits: { hits: nestedProducts } });

    const getComponent = (selected: CalculatorSteps) => (
      <MicroCopy.Provider values={en}>
        <PitchedRoofCalculatorSteps
          selected={selected}
          setSelected={setSelected}
          calculatorConfig={null}
        />
      </MicroCopy.Provider>
    );
    const { rerender } = render(getComponent(selected));

    stepProps[CalculatorSteps.SelectRoof].nextButtonOnClick(createFormEvent(), {
      roof: roofs[0].id
    });
    rerender(getComponent(selected));

    stepProps[CalculatorSteps.EnterDimensions].nextButtonOnClick(
      createFormEvent(),
      dimensions
    );
    await waitFor(() => expect(selected).toBe(CalculatorSteps.SelectTile));
    rerender(getComponent(selected));

    stepProps[CalculatorSteps.SelectTile].nextButtonOnClick(createFormEvent(), {
      tile: tile.baseProduct.code
    });
    rerender(getComponent(selected));

    stepProps[CalculatorSteps.SelectVariant].nextButtonOnClick(
      createFormEvent(),
      { variant: variant.externalProductCode }
    );
    //first request to fetch main products and second two fetch nested products
    expect(mockedES).toBeCalledTimes(2);
    await waitFor(() => expect(selected).toBe(CalculatorSteps.TileOptions));

    rerender(getComponent(selected));
    stepProps[CalculatorSteps.TileOptions].backButtonOnClick();
    rerender(getComponent(selected));

    stepProps[CalculatorSteps.SelectVariant].nextButtonOnClick(
      createFormEvent(),
      { variant: variant.externalProductCode }
    );
    expect(mockedES).toBeCalledTimes(2);
  });

  it("shouldn't send second request on gutter selection step if user selects the same gutter twice", async () => {
    mockedES = jest
      .spyOn(elasticSearch, "queryElasticSearch")
      .mockResolvedValueOnce({ hits: { hits: mainProducts } })
      .mockResolvedValueOnce({ hits: { hits: [] } })
      .mockResolvedValueOnce({ hits: { hits: [] } });

    const getComponent = (selected: CalculatorSteps) => (
      <MicroCopy.Provider values={en}>
        <PitchedRoofCalculatorSteps
          selected={selected}
          setSelected={setSelected}
          calculatorConfig={null}
        />
      </MicroCopy.Provider>
    );
    const { rerender } = render(getComponent(selected));

    stepProps[CalculatorSteps.SelectRoof].nextButtonOnClick(createFormEvent(), {
      roof: roofs[0].id
    });
    rerender(getComponent(selected));
    stepProps[CalculatorSteps.EnterDimensions].nextButtonOnClick(
      createFormEvent(),
      dimensions
    );

    rerender(getComponent(selected));
    await waitFor(() => expect(renderedStep).toBe(CalculatorSteps.SelectTile));

    stepProps[CalculatorSteps.SelectTile].nextButtonOnClick(createFormEvent(), {
      tile: tile.baseProduct.code
    });
    rerender(getComponent(selected));

    stepProps[CalculatorSteps.SelectVariant].nextButtonOnClick(
      createFormEvent(),
      { variant: variant.externalProductCode }
    );
    await waitFor(() => expect(selected).toBe(CalculatorSteps.TileOptions));

    rerender(getComponent(selected));
    stepProps[CalculatorSteps.TileOptions].nextButtonOnClick(
      createFormEvent(),
      {
        verge: leftVergeTile.externalProductCode,
        ridge: ridgeTile.externalProductCode,
        ventilation: [ventilationHood.externalProductCode]
      }
    );
    selected = CalculatorSteps.Guttering;
    rerender(getComponent(selected));

    const gutterSelection = {
      guttering: gutter.baseProduct.code,
      gutteringVariant: gutter.externalProductCode,
      gutterHook: gutterHook.externalProductCode,
      downPipes: 3,
      downPipeConnectors: 3
    };
    stepProps[CalculatorSteps.Guttering].nextButtonOnClick(
      createFormEvent(),
      gutterSelection
    );
    //first request to fetch main products, second request to fetch product references of the main products and third request to fetch product references for the previous product references
    expect(mockedES).toBeCalledTimes(3);
    await waitFor(() =>
      expect(selected).toBe(CalculatorSteps.YourSolutionContains)
    );
    rerender(getComponent(selected));
    stepProps[CalculatorSteps.YourSolutionContains].backButtonOnClick();
    rerender(getComponent(selected));

    stepProps[CalculatorSteps.Guttering].nextButtonOnClick(
      createFormEvent(),
      gutterSelection
    );
    expect(mockedES).toBeCalledTimes(3);
  });
});

const createFormEvent = (): React.FormEvent<Element> => {
  return {
    preventDefault: () => {}
  } as React.FormEvent<Element>;
};
