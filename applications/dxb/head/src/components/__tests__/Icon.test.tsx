import React from "react";
import { render } from "@testing-library/react";
import Icon from "../Icon";

describe("Icon component", () => {
  it("renders correctly", () => {
    const { container } = render(<Icon name="Mail" />);
    expect(container).toMatchSnapshot();
  });
});
