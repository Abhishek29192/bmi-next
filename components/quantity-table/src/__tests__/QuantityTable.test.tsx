import React from "react";
import { render } from "@testing-library/react";
import QuantityTable from "..";
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
    const fakeFunction = jest.fn();
    const { container } = render(
      <QuantityTable
        onDelete={fakeFunction}
        onChangeQuantity={fakeFunction}
        rows={rowsTemplate}
        {...{
          title: "Product",
          packSize: "Pack size",
          externalProductCode: "Nobb no",
          quantity: "Quantity",
          remove: "Remove"
        }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
