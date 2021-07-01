import React from "react";
import { fireEvent, render } from "@testing-library/react";
import CardCheckboxGroup from "../";
import demoImage from "./images/demo-product.jpg";
import demoFormattedImage from "./images/demo-product-format.jpg";

describe("CardCheckboxGroup component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <CardCheckboxGroup name="tileType">
        <CardCheckboxGroup.Item
          value="Zanda Arktis"
          title="Zanda Arktis"
          imageSource={demoFormattedImage}
        >
          <CardCheckboxGroup.Item.Paragraph>
            6 colours
          </CardCheckboxGroup.Item.Paragraph>
        </CardCheckboxGroup.Item>
        <CardCheckboxGroup.Item
          value="Aerodek Traditional"
          title="Aerodek Traditional"
          imageSource={demoImage}
        >
          <CardCheckboxGroup.Item.Paragraph>
            6 colours
          </CardCheckboxGroup.Item.Paragraph>
        </CardCheckboxGroup.Item>
      </CardCheckboxGroup>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders with initial value", () => {
    const { container } = render(
      <CardCheckboxGroup name="tileType" defaultValue={["Zanda Arktis"]}>
        <CardCheckboxGroup.Item
          value="Zanda Arktis"
          title="Zanda Arktis"
          imageSource={demoFormattedImage}
        >
          <CardCheckboxGroup.Item.Paragraph>
            6 colours
          </CardCheckboxGroup.Item.Paragraph>
        </CardCheckboxGroup.Item>
        <CardCheckboxGroup.Item
          value="Aerodek Traditional"
          title="Aerodek Traditional"
          imageSource={demoImage}
        >
          <CardCheckboxGroup.Item.Paragraph>
            6 colours
          </CardCheckboxGroup.Item.Paragraph>
        </CardCheckboxGroup.Item>
      </CardCheckboxGroup>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("calls onChange", () => {
    const handleOnChange = jest.fn();

    const { container } = render(
      <CardCheckboxGroup name="tileType" onChange={handleOnChange}>
        <CardCheckboxGroup.Item
          value="Zanda Arktis"
          title="Zanda Arktis"
          imageSource={demoFormattedImage}
        >
          <CardCheckboxGroup.Item.Paragraph>
            6 colours
          </CardCheckboxGroup.Item.Paragraph>
        </CardCheckboxGroup.Item>
        <CardCheckboxGroup.Item
          value="Aerodek Traditional"
          title="Aerodek Traditional"
          imageSource={demoImage}
        >
          <CardCheckboxGroup.Item.Paragraph>
            6 colours
          </CardCheckboxGroup.Item.Paragraph>
        </CardCheckboxGroup.Item>
      </CardCheckboxGroup>
    );

    fireEvent.click(container.querySelectorAll("label")[1]);

    expect(handleOnChange.mock.calls).toMatchSnapshot();
  });
});