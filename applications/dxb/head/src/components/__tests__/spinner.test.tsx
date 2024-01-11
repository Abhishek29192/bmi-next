import { describe, it } from "@jest/globals";
import { render } from "@testing-library/react";
import React from "react";
import Spinner from "../spinner";

describe("Spinner", () => {
  it("renders the spinner properly", () => {
    const { baseElement } = render(<Spinner />);

    expect(baseElement).toMatchSnapshot();
  });
});
