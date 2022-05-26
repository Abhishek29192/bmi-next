import React from "react";
import { render as rtlRender, screen, fireEvent } from "@testing-library/react";
import RoofSelection, { RoofSelecionProps } from "../_RoofSelection";
import { MicroCopy } from "../../helpers/microCopy";
import en from "../../samples/copy/en.json";

const defaultProps: RoofSelecionProps = {
  select: jest.fn(),
  requiredRoofShapes: [{ id: "1", name: "1" }]
};

const render = (props: Partial<RoofSelecionProps> = {}) => {
  const finalProps = { ...defaultProps, ...props };

  const Wrapper: React.FC = (props) => (
    <MicroCopy.Provider values={en}>{props.children}</MicroCopy.Provider>
  );

  rtlRender(<RoofSelection {...finalProps} />, { wrapper: Wrapper });
};

describe("PitchedRoofCalculator RoofSelection component", () => {
  it("renders only required roofs", () => {
    render();
    expect(screen.getByText("Roof 1")).toBeInTheDocument();
    expect(screen.getAllByRole("radio").length).toBe(1);
  });

  it("calls select function when user selects a roof shape", () => {
    render();
    fireEvent.click(screen.getByText("Roof 1"));
    expect(defaultProps.select).toBeCalledTimes(1);
  });

  it("should not render roof shapes", () => {
    render({ requiredRoofShapes: [] });
    expect(screen.queryAllByRole("radio").length).toBe(0);
  });
});
