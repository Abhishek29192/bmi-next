import React from "react";
import { render } from "@testing-library/react";
import { act } from "@testing-library/react";
import roofs from "../calculation/roofs";
import { MicroCopy } from "../helpers/microCopy";
import data from "../samples/data.json";
import en from "../samples/copy/en.json";
import PitchedRoofCalculatorSteps from "../_PitchedRoofCalculatorSteps";

let componentProps = {};
jest.mock("../_RoofSelection", () => {
  const RoofSelection = (props) => {
    componentProps["_RoofSelection"] = props;
    return <p>Rendering _RoofSelection</p>;
  };
  return {
    __esModule: true,
    default: RoofSelection
  };
});
jest.mock("../_RoofDimensions", () => {
  const RoofDimensions = (props) => {
    componentProps["_RoofDimensions"] = props;
    return <p>Rendering _RoofDimensions</p>;
  };
  return {
    __esModule: true,
    default: RoofDimensions
  };
});
jest.mock("../_TileSelection", () => {
  const TileSelection = (props) => {
    componentProps["_TileSelection"] = props;
    return <p>Rendering _TileSelection</p>;
  };
  return {
    __esModule: true,
    default: TileSelection
  };
});
jest.mock("../_TileOptions", () => {
  const TileOptions = (props) => {
    componentProps["_TileOptions"] = props;
    return <p>Rendering _TileOptions</p>;
  };
  return {
    __esModule: true,
    default: TileOptions
  };
});
jest.mock("../_VariantSelection", () => {
  const VariantSelection = (props) => {
    componentProps["_VariantSelection"] = props;
    return <p>Rendering _VariantSelection</p>;
  };
  return {
    __esModule: true,
    default: VariantSelection
  };
});
jest.mock("../_UnderlaySelection", () => {
  const UnderlaySelection = (props) => {
    componentProps["_UnderlaySelection"] = props;
    return <p>Rendering _UnderlaySelection</p>;
  };
  return {
    __esModule: true,
    default: UnderlaySelection
  };
});
jest.mock("../_Guttering", () => {
  const Guttering = (props) => {
    componentProps["_Guttering"] = props;
    return <p>Rendering _Guttering</p>;
  };
  return {
    __esModule: true,
    default: Guttering
  };
});
jest.mock("../_Results", () => {
  const Results = (props) => {
    componentProps["_Results"] = props;
    return <p>Rendering _Results</p>;
  };
  return {
    __esModule: true,
    default: Results
  };
});

let renderedStep;
const stepProps = {};
jest.mock(`@bmi/calculator-stepper`, () => {
  const CalculatorStepper = ({ selected, children }) => {
    renderedStep = selected;
    return React.Children.toArray(children)
      .filter((item) => (item["key"] + "").substr(2) === selected)
      .map((element: React.ReactElement) =>
        React.cloneElement(element, {
          passedKey: (element.key + "").substr(2)
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
          selected="select-roof"
          setSelected={jest.fn()}
          sendEmailAddress={jest.fn()}
          data={data as any}
        />
      </MicroCopy.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("moves through the steps", async () => {
    let selected = "select-roof";
    const setSelected = jest
      .fn()
      .mockImplementation((selection) => (selected = selection));
    const sendEmailAddress = jest.fn();

    const getComponent = (selected: Step) => (
      <MicroCopy.Provider values={en}>
        <PitchedRoofCalculatorSteps
          selected={selected}
          setSelected={setSelected}
          sendEmailAddress={sendEmailAddress}
          data={data as any}
        />
      </MicroCopy.Provider>
    );

    const { rerender } = render(getComponent(selected));

    expect(renderedStep).toBe("select-roof");

    act(() => componentProps["_RoofSelection"].select(roofs[0]));
    rerender(getComponent(selected));
    expect(renderedStep).toBe("enter-dimensions");

    act(() =>
      stepProps["enter-dimensions"].nextButtonOnClick!(createFormEvent(), {
        A: "9",
        B: "15",
        P: "22",
        protrusions: []
      })
    );
    rerender(getComponent(selected));
    expect(renderedStep).toBe("select-tile");

    const tile = data.mainTiles[0];

    act(() => componentProps["_TileSelection"].select(tile));
    rerender(getComponent(selected));
    expect(renderedStep).toBe("select-variant");

    const variant = tile.variants[0];

    act(() => componentProps["_VariantSelection"].select(variant));
    rerender(getComponent(selected));
    expect(renderedStep).toBe("tile-options");

    act(() =>
      stepProps["tile-options"].nextButtonOnClick!(createFormEvent(), {
        verge: "none",
        ridge: variant.ridgeOptions[0].externalProductCode,
        ventilation: "none"
      })
    );
    rerender(getComponent(selected));
    expect(renderedStep).toBe("select-underlay");

    const underlay = data.underlays[0];

    act(() =>
      stepProps["select-underlay"].nextButtonOnClick!(createFormEvent(), {
        underlay: underlay.externalProductCode
      })
    );
    rerender(getComponent(selected));
    expect(renderedStep).toBe("guttering");

    act(() => stepProps["guttering"].linkOnClick!());
    rerender(getComponent(selected));
    expect(renderedStep).toBe("your-solution-contains");

    act(() => stepProps["your-solution-contains"].backButtonOnClick!());
    rerender(getComponent(selected));
    expect(renderedStep).toBe("guttering");

    const gutter = data.gutters[0];
    const gutterVariant = gutter.variants[0];
    const gutterHook = data.gutterHooks[0];

    act(() =>
      stepProps["guttering"].nextButtonOnClick!(createFormEvent(), {
        guttering: gutter.name,
        gutteringVariant: gutterVariant.externalProductCode,
        gutteringHook: gutterHook.externalProductCode,
        downPipes: 10,
        downPipeConnectors: 15
      })
    );
    rerender(getComponent(selected));
    expect(renderedStep).toBe("your-solution-contains");

    [
      ["your-solution-contains", "guttering"],
      ["guttering", "select-underlay"],
      ["select-underlay", "tile-options"],
      ["tile-options", "select-variant"],
      ["select-variant", "select-tile"],
      ["select-tile", "enter-dimensions"],
      ["enter-dimensions", "select-roof"]
    ].forEach(([current, previous]) => {
      // eslint-disable-next-line security/detect-object-injection
      act(() => stepProps[current].backButtonOnClick());
      rerender(getComponent(selected));
      expect(renderedStep).toBe(previous);
    });
  });
});

const createFormEvent = (): React.FormEvent<Element> => {
  return {
    preventDefault: () => {}
  } as React.FormEvent<Element>;
};
