import { describe, it } from "@jest/globals";
import { render } from "@testing-library/react";
import React from "react";
import Callback from "../callback";

describe("Callback", () => {
  it("renders the callback properly", () => {
    const { baseElement } = render(<Callback />);

    expect(baseElement).toMatchSnapshot();
  });
});
