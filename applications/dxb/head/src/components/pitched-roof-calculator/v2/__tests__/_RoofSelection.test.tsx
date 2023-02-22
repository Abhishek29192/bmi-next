import { ThemeProvider } from "@bmi-digital/components";
import {
  fireEvent,
  render as rtlRender,
  screen,
  waitFor
} from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../../helpers/microCopy";
import en from "../../samples/copy/en.json";
import RoofSelection, { RoofSelectionProps } from "../_RoofSelection";

const defaultProps: RoofSelectionProps = {
  requiredRoofShapes: [{ roofShapeId: "1" }],
  name: "roof",
  isRequired: true,
  fieldIsRequiredError: "field is required"
};

const pushEvent = jest.fn();
jest.mock("../../helpers/analytics", () => {
  const actual = jest.requireActual("../../helpers/analytics");
  return {
    ...actual,
    useAnalyticsContext: () => pushEvent
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

const render = (props: Partial<RoofSelectionProps> = {}) => {
  const finalProps = { ...defaultProps, ...props };

  const Wrapper: React.FC = (props) => (
    <ThemeProvider>
      <MicroCopy.Provider values={en}>{props.children}</MicroCopy.Provider>
    </ThemeProvider>
  );

  rtlRender(<RoofSelection {...finalProps} />, { wrapper: Wrapper });
};

describe("PitchedRoofCalculator RoofSelection component", () => {
  it("renders only required roofs", () => {
    render();
    expect(screen.getAllByText("MC: roofSelection.roof").length).toBe(1);
  });

  it("calls analytics event when user selects roof shape", () => {
    render();
    fireEvent.click(screen.getByText("MC: roofSelection.roof"));
    waitFor(() =>
      expect(pushEvent).toBeCalledWith({
        event: "dxb.button_click",
        id: "rc-roof-type",
        label: "MC: roofSelection.roof",
        action: "selected"
      })
    );
  });

  it("renders correctly without roof shapes", () => {
    render({ requiredRoofShapes: [] });
    expect(screen.queryAllByRole("radio").length).toBe(0);
  });
});
