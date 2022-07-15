import { act, render } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../../helpers/microCopy";
import en from "../../samples/copy/en.json";
import data from "../../samples/v2/data.json";
import { CalculatorSteps } from "../../types";
import { MainTile } from "../../types/v2";
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
import { TileSelecionProps } from "../_TileSelection";
import { UnderlaySelectionProps } from "../_UnderlaySelection";
import { VariantSelecionProps } from "../_VariantSelection";

let componentProps: {
  _RoofSelection?: RoofSelectionProps;
  _RoofDimensions?: RoofDimensionsProps;
  _TileSelection?: TileSelecionProps;
  _TileOptions?: TileOptionsProps;
  _VariantSelection?: VariantSelecionProps;
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
  const TileSelection = (props: TileSelecionProps) => {
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
  const VariantSelection = (props: VariantSelecionProps) => {
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

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  componentProps = {};
});

describe("PitchedRoofCalculatorSteps component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <MicroCopy.Provider values={en}>
        <PitchedRoofCalculatorSteps
          selected={CalculatorSteps.SelectRoof}
          setSelected={jest.fn()}
          data={data as any}
        />
      </MicroCopy.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("moves through the steps", async () => {
    let selected = CalculatorSteps.SelectRoof;
    const setSelected = jest
      .fn()
      .mockImplementation(
        (selection: CalculatorSteps.SelectRoof) => (selected = selection)
      );

    const getComponent = (selected: CalculatorSteps) => (
      <MicroCopy.Provider values={en}>
        <PitchedRoofCalculatorSteps
          selected={selected}
          setSelected={setSelected}
          data={data as any}
        />
      </MicroCopy.Provider>
    );

    const { rerender, debug } = render(getComponent(selected));

    debug();

    expect(renderedStep).toBe(CalculatorSteps.SelectRoof);

    act(() => componentProps["_RoofSelection"]!.select(roofs[0]));
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.EnterDimensions);

    act(() =>
      stepProps[CalculatorSteps.EnterDimensions].nextButtonOnClick!(
        createFormEvent(),
        {
          A: "9",
          B: "15",
          P: "22",
          protrusions: []
        }
      )
    );
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.SelectTile);

    const tile = data.mainTiles[0] as MainTile;

    act(() => componentProps["_TileSelection"]!.select(tile));
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.SelectVariant);

    const variant = tile.variants[0];

    act(() => componentProps["_VariantSelection"]!.select(variant));
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.TileOptions);

    act(() =>
      stepProps[CalculatorSteps.TileOptions].nextButtonOnClick!(
        createFormEvent(),
        {
          verge: "none",
          ridge: variant.ridgeOptions[0].externalProductCode,
          ventilation: "none"
        }
      )
    );
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.SelectUnderlay);

    const underlay = data.underlays[0];

    act(() =>
      stepProps[CalculatorSteps.SelectUnderlay].nextButtonOnClick!(
        createFormEvent(),
        {
          underlay: underlay.externalProductCode
        }
      )
    );
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.Guttering);

    act(() => stepProps[CalculatorSteps.Guttering].linkOnClick!());
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.YourSolutionContains);

    act(() =>
      stepProps[CalculatorSteps.YourSolutionContains].backButtonOnClick!()
    );
    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.Guttering);

    const gutter = data.gutters[0];
    const gutterVariant = gutter.variants[0];
    const gutterHook = data.gutterHooks[0];

    act(() =>
      stepProps[CalculatorSteps.Guttering].nextButtonOnClick!(
        createFormEvent(),
        {
          guttering: gutter.name,
          gutteringVariant: gutterVariant.externalProductCode,
          gutteringHook: gutterHook.externalProductCode,
          downPipes: 10,
          downPipeConnectors: 15
        }
      )
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
      act(() => stepProps[current]!.backButtonOnClick!());
      rerender(getComponent(selected));
      expect(renderedStep).toBe(previous);
    });
  });

  it("moves to the first step from the last step", async () => {
    let selected = CalculatorSteps.YourSolutionContains;
    const setSelected = jest
      .fn()
      .mockImplementation(
        (selection: CalculatorSteps.SelectRoof) => (selected = selection)
      );

    const getComponent = (selected: CalculatorSteps) => (
      <MicroCopy.Provider values={en}>
        <PitchedRoofCalculatorSteps
          selected={selected}
          setSelected={setSelected}
          data={data as any}
        />
      </MicroCopy.Provider>
    );

    const { rerender } = render(getComponent(selected));
    stepProps[CalculatorSteps.YourSolutionContains].linkOnClick();

    rerender(getComponent(selected));
    expect(renderedStep).toBe(CalculatorSteps.SelectRoof);
  });
});

const createFormEvent = (): React.FormEvent<Element> => {
  return {
    preventDefault: () => {}
  } as React.FormEvent<Element>;
};
