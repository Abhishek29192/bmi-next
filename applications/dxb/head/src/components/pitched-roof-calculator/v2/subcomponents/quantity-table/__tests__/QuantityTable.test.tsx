import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ProductCategory, ResultsRow } from "../../../../types";
import QuantityTable, {
  BuildLargeViewRows,
  BuildMediumViewRows,
  BuildSmallViewRows
} from "../QuantityTable";
import tileBrown from "./images/tile-brown.jpg";

const rowsTemplate: ResultsRow[] = [
  {
    image: tileBrown,
    description: "First item",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43,
    category: ProductCategory.Tiles
  },
  {
    image: tileBrown,
    description: "Second item",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43,
    category: ProductCategory.Tiles
  },
  {
    image: tileBrown,
    description: "Third item",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43,
    category: ProductCategory.Tiles
  },
  {
    image: tileBrown,
    description: "Fourth item",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43,
    category: ProductCategory.Tiles
  },
  {
    image: tileBrown,
    description: "Fifth item",
    externalProductCode: "123456789",
    packSize: "22 x 42",
    quantity: 43,
    category: ProductCategory.Tiles
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
  const onDelete = jest.fn();
  const onChangeQuantity = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("onDelete execute correctly", () => {
    render(
      <BuildSmallViewRows
        onDelete={onDelete}
        onChangeQuantity={onChangeQuantity}
        rows={rowsTemplate}
      />
    );

    fireEvent.click(
      screen.getByLabelText(`Remove ${rowsTemplate[0].description}`)
    );
    expect(onDelete).toHaveBeenCalledWith(rowsTemplate[0]);
  });

  it("onChangeQuantity execute correctly", () => {
    render(
      <BuildSmallViewRows
        onDelete={onDelete}
        onChangeQuantity={onChangeQuantity}
        rows={rowsTemplate}
      />
    );

    fireEvent.click(screen.getAllByLabelText("Up")[0]);
    expect(onChangeQuantity).toHaveBeenCalledTimes(1);
    expect(onChangeQuantity).toHaveBeenCalledWith(
      rowsTemplate[0],
      rowsTemplate[0].quantity + 1
    );
  });
});

describe("BuildLargeViewRows component", () => {
  const onDelete = jest.fn();
  const onChangeQuantity = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("onDelete execute correctly", () => {
    render(
      <BuildLargeViewRows
        onDelete={onDelete}
        onChangeQuantity={onChangeQuantity}
        rows={rowsTemplate}
      />
    );

    fireEvent.click(
      screen.getByLabelText(`Remove ${rowsTemplate[0].description}`)
    );
    expect(onDelete).toHaveBeenCalledWith(rowsTemplate[0]);
  });

  it("onChangeQuantity execute correctly", () => {
    render(
      <BuildLargeViewRows
        onDelete={onDelete}
        onChangeQuantity={onChangeQuantity}
        rows={rowsTemplate}
      />
    );

    fireEvent.click(screen.getAllByLabelText("Up")[0]);
    expect(onChangeQuantity).toHaveBeenCalledTimes(1);
    expect(onChangeQuantity).toHaveBeenCalledWith(
      rowsTemplate[0],
      rowsTemplate[0].quantity + 1
    );
  });
});

describe("BuildMediumViewRows component", () => {
  const onDelete = jest.fn();
  const onChangeQuantity = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls onDelete function", () => {
    render(
      <BuildMediumViewRows
        onDelete={onDelete}
        onChangeQuantity={onChangeQuantity}
        rows={rowsTemplate}
      />
    );

    fireEvent.click(
      screen.getByLabelText(`Remove ${rowsTemplate[0].description}`)
    );
    expect(onDelete).toHaveBeenCalledWith(rowsTemplate[0]);
  });

  it("calls onChangeQuantity function", () => {
    render(
      <BuildMediumViewRows
        onDelete={onDelete}
        onChangeQuantity={onChangeQuantity}
        rows={rowsTemplate}
      />
    );

    fireEvent.click(screen.getAllByLabelText("Up")[0]);
    expect(onChangeQuantity).toHaveBeenCalledTimes(1);
    expect(onChangeQuantity).toHaveBeenCalledWith(
      rowsTemplate[0],
      rowsTemplate[0].quantity + 1
    );
  });
});
