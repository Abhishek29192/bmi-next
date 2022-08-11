import { fireEvent, render as rtlRender, screen } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../../helpers/microCopy";
import en from "../../samples/copy/en.json";
import RoofSelection, { RoofSelectionProps } from "../_RoofSelection";

const defaultProps: RoofSelectionProps = {
  select: jest.fn(),
  requiredRoofShapes: [{ roofShapeId: "1" }]
};

const render = (props: Partial<RoofSelectionProps> = {}) => {
  const finalProps = { ...defaultProps, ...props };

  const Wrapper: React.FC = (props) => (
    <MicroCopy.Provider values={en}>{props.children}</MicroCopy.Provider>
  );

  rtlRender(<RoofSelection {...finalProps} />, { wrapper: Wrapper });
};

describe("PitchedRoofCalculator RoofSelection component", () => {
  it("renders only required roofs", () => {
    render();
    expect(screen.getAllByText("MC: roofSelection.roof").length).toBe(1);
  });

  it("calls select function when user selects a roof shape", () => {
    render();
    fireEvent.click(screen.getAllByText("MC: roofSelection.roof")[0]);
    expect(defaultProps.select).toBeCalledTimes(1);
  });

  it("should not render roof shapes", () => {
    render({ requiredRoofShapes: [] });
    expect(screen.queryAllByRole("radio").length).toBe(0);
  });
});
