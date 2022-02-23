import React from "react";
import { render } from "@testing-library/react";
import RadioPane from "../RadioPane";

describe("RadioPane component", () => {
  it("renders without children", () => {
    const { container } = render(
      <RadioPane name="f1" value="v1" title={"Value 1"} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with className", () => {
    const { container } = render(
      <RadioPane
        name="f1"
        value="v1"
        title={"Value 1"}
        className={"custom-classname"}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders expanded with children", () => {
    const { container } = render(
      <RadioPane name="f1" value="v1" title={"Value 1"}>
        expanded content
      </RadioPane>
    );
    expect(container).toMatchSnapshot();
  });
});
