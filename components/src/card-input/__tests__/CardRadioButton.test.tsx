import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CardInput from "../CardInput";
import demoFormattedImage from "./images/demo-product-format.jpg";

describe("CardInput component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <CardInput
        name="tileType"
        value="Aerodek Classic"
        title="Aerodek Classic"
        imageSource={demoFormattedImage}
      >
        <CardInput.Paragraph>6 colours </CardInput.Paragraph>
      </CardInput>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders as checkbox", () => {
    const { container } = render(
      <CardInput
        type="checkbox"
        name="tileType"
        value="Aerodek Classic"
        title="Aerodek Classic"
        imageSource={demoFormattedImage}
      >
        <CardInput.Paragraph>6 colours </CardInput.Paragraph>
      </CardInput>
    );

    expect(container).toMatchSnapshot();
  });

  it("calls onChange", () => {
    const handleOnChange = jest.fn();

    const { container } = render(
      <CardInput
        name="tileType"
        value="Aerodek Classic"
        title="Aerodek Classic"
        imageSource={demoFormattedImage}
        onChange={handleOnChange}
      >
        <CardInput.Paragraph>6 colours </CardInput.Paragraph>
      </CardInput>
    );

    fireEvent.click(container.querySelector("label")!);

    expect(handleOnChange.mock.calls).toMatchSnapshot();
  });
});
