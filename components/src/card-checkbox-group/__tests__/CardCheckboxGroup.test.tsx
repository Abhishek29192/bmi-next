import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import CardCheckboxGroup from "../CardCheckboxGroup";
import demoFormattedImage from "./images/demo-product-format.jpg";
import demoImage from "./images/demo-product.jpg";

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
    expect(container).toMatchSnapshot();
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
    expect(container).toMatchSnapshot();
  });

  it("renders with none label string", () => {
    const onChange = jest.fn();
    render(
      <CardCheckboxGroup
        name="tileType"
        noneLabel="none label"
        onChange={onChange}
      >
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
    fireEvent.click(screen.getByDisplayValue("none"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("calls onChange with null", () => {
    const onChange = jest.fn();
    render(
      <CardCheckboxGroup
        name="tileType"
        noneLabel="none label"
        onChange={onChange}
      >
        <CardCheckboxGroup.Item
          value="Zanda Arktis"
          title="Zanda Arktis"
          imageSource={demoFormattedImage}
        >
          <CardCheckboxGroup.Item.Paragraph>
            6 colours
          </CardCheckboxGroup.Item.Paragraph>
        </CardCheckboxGroup.Item>
      </CardCheckboxGroup>
    );

    fireEvent.click(screen.getByDisplayValue("none"));
    fireEvent.click(screen.getByDisplayValue("none"));
    expect(onChange).toHaveBeenCalledWith(null);
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
    fireEvent.click(container.querySelectorAll("label")[1]);
    expect(handleOnChange.mock.calls).toMatchSnapshot();
  });

  it("not an radio item element", () => {
    render(
      <CardCheckboxGroup name="tileType">
        <article>test one</article>
        <article>test two</article>
      </CardCheckboxGroup>
    );
    const testarticle = screen.queryAllByText("test one");
    expect(testarticle).not.toBeNull();
  });
});
