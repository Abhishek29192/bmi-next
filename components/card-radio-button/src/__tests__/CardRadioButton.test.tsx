import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CardRadioButton from "../";
import demoFormattedImage from "./images/demo-product-format.jpg";

describe("CardRadioButton component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <CardRadioButton
        name="tileType"
        value="Aerodek Classic"
        title="Aerodek Classic"
        imageSource={demoFormattedImage}
      >
        <CardRadioButton.Paragraph>6 colours </CardRadioButton.Paragraph>
      </CardRadioButton>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("calls onChange", () => {
    const handleOnChange = jest.fn();

    const { container } = render(
      <CardRadioButton
        name="tileType"
        value="Aerodek Classic"
        title="Aerodek Classic"
        imageSource={demoFormattedImage}
        onChange={handleOnChange}
      >
        <CardRadioButton.Paragraph>6 colours </CardRadioButton.Paragraph>
      </CardRadioButton>
    );

    fireEvent.click(container.querySelector("label"));

    expect(handleOnChange.mock.calls).toMatchSnapshot();
  });
});
