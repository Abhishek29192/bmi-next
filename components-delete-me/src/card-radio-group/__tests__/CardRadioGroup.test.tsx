import React from "react";
import { fireEvent } from "@testing-library/react";
import CardRadioGroup from "../CardRadioGroup";
import { renderWithThemeProvider } from "../../__tests__/helper";
import demoImage from "./images/demo-product.jpg";
import demoFormattedImage from "./images/demo-product-format.jpg";

describe("CardRadioGroup component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <CardRadioGroup name="tileType">
        <CardRadioGroup.Item
          value="Zanda Arktis"
          title="Zanda Arktis"
          imageSource={demoFormattedImage}
        >
          <CardRadioGroup.Item.Paragraph>
            6 colours
          </CardRadioGroup.Item.Paragraph>
        </CardRadioGroup.Item>
        <CardRadioGroup.Item
          value="Aerodek Traditional"
          title="Aerodek Traditional"
          imageSource={demoImage}
        >
          <CardRadioGroup.Item.Paragraph>
            6 colours
          </CardRadioGroup.Item.Paragraph>
        </CardRadioGroup.Item>
      </CardRadioGroup>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with initial value", () => {
    const { container } = renderWithThemeProvider(
      <CardRadioGroup name="tileType" defaultValue={"Zanda Arktis"}>
        <CardRadioGroup.Item
          value="Zanda Arktis"
          title="Zanda Arktis"
          imageSource={demoFormattedImage}
        >
          <CardRadioGroup.Item.Paragraph>
            6 colours
          </CardRadioGroup.Item.Paragraph>
        </CardRadioGroup.Item>
        <CardRadioGroup.Item
          value="Aerodek Traditional"
          title="Aerodek Traditional"
          imageSource={demoImage}
        >
          <CardRadioGroup.Item.Paragraph>
            6 colours
          </CardRadioGroup.Item.Paragraph>
        </CardRadioGroup.Item>
      </CardRadioGroup>
    );
    expect(container).toMatchSnapshot();
  });

  it("calls onChange", () => {
    const handleOnChange = jest.fn();

    const { container } = renderWithThemeProvider(
      <CardRadioGroup name="tileType" onChange={handleOnChange}>
        <CardRadioGroup.Item
          value="Zanda Arktis"
          title="Zanda Arktis"
          imageSource={demoFormattedImage}
        >
          <CardRadioGroup.Item.Paragraph>
            6 colours
          </CardRadioGroup.Item.Paragraph>
        </CardRadioGroup.Item>
        <CardRadioGroup.Item
          value="Aerodek Traditional"
          title="Aerodek Traditional"
          imageSource={demoImage}
        >
          <CardRadioGroup.Item.Paragraph>
            6 colours
          </CardRadioGroup.Item.Paragraph>
        </CardRadioGroup.Item>
      </CardRadioGroup>
    );
    fireEvent.click(container.querySelectorAll("label")[1]);

    expect(handleOnChange.mock.calls).toMatchSnapshot();
  });

  it("renders non radio item element", () => {
    const { queryByText } = renderWithThemeProvider(
      <CardRadioGroup name="titleType">
        <div>test</div>
      </CardRadioGroup>
    );
    const testItem = queryByText("test");
    expect(testItem).not.toBeNull();
  });
});
