import roofs from "../calculation/roofs";
import data from "../samples/data.json";
import en from "../samples/copy/en.json";

const components = [
  "_RoofSelection",
  "_RoofDimensions",
  "_TileSelection",
  "_TileOptions",
  "_VariantSelection",
  "_UnderlaySelection",
  "_Guttering",
  "_Results"
];

let componentProps = {};

let React;
let render;
let act;
let MicroCopy;
let PitchedRoofCalculatorSteps;

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  componentProps = {};
  React = require("react");
  render = require("@testing-library/react").render;
  act = require("@testing-library/react").act;
  MicroCopy = require("../helpers/microCopy").MicroCopy;
  components.forEach((component) => {
    jest.mock(`../${component}`, () => ({
      __esModule: true,
      default: jest.fn().mockImplementation((props) => {
        componentProps[component] = props;
        return <p>Rendering {component}</p>;
      })
    }));
  });
});

describe("PitchedRoofCalculatorSteps component", () => {
  it("renders correctly", () => {
    PitchedRoofCalculatorSteps =
      require("../_PitchedRoofCalculatorSteps").default;

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
    let renderedStep;
    const stepProps = {};
    jest.mock(`@bmi/calculator-stepper`, () => {
      const CalculatorStepper = ({ selected, children }) => {
        renderedStep = selected;
        return React.Children.toArray(children)
          .filter((item) => (item.key + "").substr(2) === selected)
          .map((element) =>
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

    PitchedRoofCalculatorSteps =
      require("../_PitchedRoofCalculatorSteps").default;

    let selected = "select-roof";
    const setSelected = jest
      .fn()
      .mockImplementation((selection) => (selected = selection));
    const sendEmailAddress = jest.fn();

    const getComponent = (selected) => (
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
      stepProps["enter-dimensions"].nextButtonOnClick(
        { preventDefault: () => {} },
        {
          A: "9",
          B: "15",
          P: "22",
          protrusions: []
        }
      )
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
      stepProps["tile-options"].nextButtonOnClick(
        { preventDefault: () => {} },
        {
          verge: "none",
          ridge: variant.ridgeOptions[0].externalProductCode,
          ventilation: "none"
        }
      )
    );
    rerender(getComponent(selected));
    expect(renderedStep).toBe("select-underlay");

    const underlay = data.underlays[0];

    act(() =>
      stepProps["select-underlay"].nextButtonOnClick(
        { preventDefault: () => {} },
        {
          underlay: underlay.externalProductCode
        }
      )
    );
    rerender(getComponent(selected));
    expect(renderedStep).toBe("guttering");

    act(() => stepProps["guttering"].linkOnClick());
    rerender(getComponent(selected));
    expect(renderedStep).toBe("your-solution-contains");

    act(() => stepProps["your-solution-contains"].backButtonOnClick());
    rerender(getComponent(selected));
    expect(renderedStep).toBe("guttering");

    const gutter = data.gutters[0];
    const gutterVariant = gutter.variants[0];
    const gutterHook = data.gutterHooks[0];

    act(() =>
      stepProps["guttering"].nextButtonOnClick(
        { preventDefault: () => {} },
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
      act(() => stepProps[current].backButtonOnClick());
      rerender(getComponent(selected));
      expect(renderedStep).toBe(previous);
    });
  });
});
