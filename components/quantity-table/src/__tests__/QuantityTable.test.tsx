import React from "react";
import { render } from "@testing-library/react";
import QuantityTable from "..";
import tileBrown from "./images/tile-brown.jpg";

const rowsTemplate = [
  {
    imageSource: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    nobb: 123456789,
    packSize: "22 x 42",
    productAmount: 43
  },
  {
    imageSource: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    nobb: 523456789,
    packSize: "14 x 82",
    productAmount: 22
  },
  {
    imageSource: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    nobb: 223456789,
    packSize: "-",
    productAmount: 52
  },
  {
    imageSource: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    nobb: 323456789,
    packSize: "5 x 9",
    productAmount: 22
  },
  {
    imageSource: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    nobb: 423456789,
    packSize: "263 x 1",
    productAmount: 52
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
        title="Tile Products"
        packSize="Pack size"
        nobbNumber="Nobb no"
        quantity="Quantity"
        remove="Remove"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
