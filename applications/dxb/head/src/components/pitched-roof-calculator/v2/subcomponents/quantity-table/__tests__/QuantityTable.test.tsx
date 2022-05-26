import React from "react";
import { render, fireEvent } from "@testing-library/react";
import QuantityTable from "../QuantityTable";
import tileBrown from "./images/tile-brown.jpg";

const rowsTemplate = [
  {
    image: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43
  },
  {
    image: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43
  },
  {
    image: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43
  },
  {
    image: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43
  },
  {
    image: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43
  }
];

describe("QuantityTable component", () => {
  it("renders correctly", () => {
    const onDelete = jest.fn();
    const onChangeQuantity = jest.fn();
    const { container } = render(
      <QuantityTable
        onDelete={onDelete}
        onChangeQuantity={onChangeQuantity}
        rows={rowsTemplate}
        title="Product"
        packSize="Pack size"
        externalProductCode="Nobb no"
        quantity="Quantity"
        remove="Remove"
      />
    );
    expect(container).toMatchSnapshot();
  });
});

describe("BuildSmallViewRows component", () => {
  it("onDelete execute correctly", () => {
    const onDelete = jest.fn();
    const onChangeQuantity = jest.fn();
    const { container } = render(
      <QuantityTable
        onDelete={onDelete}
        onChangeQuantity={onChangeQuantity}
        rows={rowsTemplate}
        title="Product"
        packSize="Pack size"
        externalProductCode="Nobb no"
        quantity="Quantity"
        remove="Remove"
      />
    );

    const element = container.querySelectorAll(".icon")[0];

    fireEvent.click(element!);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("onChangeQuantity execute correctly", () => {
    const onDelete = jest.fn();
    const onChangeQuantity = jest.fn();

    const { getAllByLabelText } = render(
      <QuantityTable
        onDelete={onDelete}
        onChangeQuantity={onChangeQuantity}
        rows={rowsTemplate}
        title="Product"
        packSize="Pack size"
        externalProductCode="Nobb no"
        quantity="Quantity"
        remove="Remove"
      />
    );

    const element = getAllByLabelText("Up")[0];
    fireEvent.click(element);

    expect(onChangeQuantity).toHaveBeenCalledTimes(1);
  });

  it("onChangeQuantity execute with correct arguments", () => {
    const onDelete = jest.fn();
    const onChangeQuantity = jest.fn();
    const { getAllByLabelText } = render(
      <QuantityTable
        onDelete={onDelete}
        onChangeQuantity={onChangeQuantity}
        rows={rowsTemplate}
        title="Product"
        packSize="Pack size"
        externalProductCode="Nobb no"
        quantity="Quantity"
        remove="Remove"
      />
    );

    const element = getAllByLabelText("Up")[0];
    fireEvent.click(element);

    expect(onChangeQuantity).toHaveBeenCalledWith("123456789", 44);
  });
});

describe("BuildMediumViewRows component", () => {
  it("onDelete execute correctly", () => {
    const onDelete = jest.fn();
    const onChangeQuantity = jest.fn();
    const { container } = render(
      <QuantityTable
        onDelete={onDelete}
        onChangeQuantity={onChangeQuantity}
        rows={rowsTemplate}
        title="Product"
        packSize="Pack size"
        externalProductCode="Nobb no"
        quantity="Quantity"
        remove="Remove"
      />
    );

    const element = container.querySelectorAll(".icon")[5];

    fireEvent.click(element!);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("onChangeQuantity execute correctly", () => {
    const onDelete = jest.fn();
    const onChangeQuantity = jest.fn();
    const { getAllByLabelText } = render(
      <QuantityTable
        onDelete={onDelete}
        onChangeQuantity={onChangeQuantity}
        rows={rowsTemplate}
        title="Product"
        packSize="Pack size"
        externalProductCode="Nobb no"
        quantity="Quantity"
        remove="Remove"
      />
    );

    const element = getAllByLabelText("Up")[5];
    fireEvent.click(element);

    expect(onChangeQuantity).toHaveBeenCalledTimes(1);
  });

  it("onChangeQuantity execute with correct arguments", () => {
    const onDelete = jest.fn();
    const onChangeQuantity = jest.fn();
    const { getAllByLabelText } = render(
      <QuantityTable
        onDelete={onDelete}
        onChangeQuantity={onChangeQuantity}
        rows={rowsTemplate}
        title="Product"
        packSize="Pack size"
        externalProductCode="Nobb no"
        quantity="Quantity"
        remove="Remove"
      />
    );

    const element = getAllByLabelText("Up")[5];
    fireEvent.click(element);

    expect(onChangeQuantity).toHaveBeenCalledWith("123456789", 44);
  });
});
