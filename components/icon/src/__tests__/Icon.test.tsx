import { Person } from "@material-ui/icons";
import { render } from "@testing-library/react";
import React from "react";
import Icon from "../";

describe("Icon component", () => {
  it("renders correctly", () => {
    const { container } = render(<Icon source={Person} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
