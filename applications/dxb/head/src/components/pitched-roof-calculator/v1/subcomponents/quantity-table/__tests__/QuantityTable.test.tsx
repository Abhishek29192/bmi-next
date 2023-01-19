import { ThemeProvider } from "@bmi-digital/components";
import { useMediaQuery } from "@mui/material";
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import QuantityTable from "../QuantityTable";
import tileBrown from "./images/tile-brown.jpg";

const rowsTemplate = [
  {
    image: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    externalProductCode: "1232342346789",
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
    externalProductCode: "123452346789",
    packSize: "22 x 42",
    quantity: 43
  },
  {
    image: tileBrown,
    description: "Lorem ipsum dolor sit amet memento mori",
    externalProductCode: "12345677889",
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

jest.mock("@mui/material", () => ({
  ...(jest.requireActual("@mui/material") as any),
  useMediaQuery: jest.fn()
}));

const mockUseMediaQuery = useMediaQuery as jest.Mock<
  ReturnType<typeof useMediaQuery>
>;

describe("QuantityTable component", () => {
  it("renders correctly", () => {
    const onDelete = jest.fn();
    const onChangeQuantity = jest.fn();
    mockUseMediaQuery.mockReturnValue(true);
    const { container } = render(
      <ThemeProvider>
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
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});

describe("BuildSmallViewRows component", () => {
  it("onDelete execute correctly", () => {
    const onDelete = jest.fn();
    const onChangeQuantity = jest.fn();
    mockUseMediaQuery.mockReturnValue(true);
    const { getAllByTestId } = render(
      <ThemeProvider>
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
      </ThemeProvider>
    );

    const element = getAllByTestId("DeleteIcon")[0];

    fireEvent.click(element!);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("onChangeQuantity execute correctly", () => {
    const onDelete = jest.fn();
    const onChangeQuantity = jest.fn();
    mockUseMediaQuery.mockReturnValue(true);
    const { getAllByLabelText } = render(
      <ThemeProvider>
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
      </ThemeProvider>
    );

    const element = getAllByLabelText("Up")[0];
    fireEvent.click(element);

    expect(onChangeQuantity).toHaveBeenCalledTimes(1);
  });

  it("onChangeQuantity execute with correct arguments", () => {
    const onDelete = jest.fn();
    const onChangeQuantity = jest.fn();
    mockUseMediaQuery.mockReturnValue(true);
    const { getAllByLabelText } = render(
      <ThemeProvider>
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
      </ThemeProvider>
    );

    const element = getAllByLabelText("Up")[0];
    fireEvent.click(element);

    expect(onChangeQuantity).toHaveBeenCalledWith(
      rowsTemplate[0].externalProductCode,
      44
    );
  });
});

describe("BuildMediumViewRows component", () => {
  it("onDelete execute correctly", () => {
    const onDelete = jest.fn();
    const onChangeQuantity = jest.fn();
    mockUseMediaQuery.mockReturnValue(true);
    const { getAllByTestId } = render(
      <ThemeProvider>
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
      </ThemeProvider>
    );

    const element = getAllByTestId("DeleteIcon")[5];
    fireEvent.click(element!);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("onChangeQuantity execute correctly", () => {
    const onDelete = jest.fn();
    const onChangeQuantity = jest.fn();
    mockUseMediaQuery.mockReturnValue(true);
    const { getAllByLabelText } = render(
      <ThemeProvider>
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
      </ThemeProvider>
    );

    const element = getAllByLabelText("Up")[5];
    fireEvent.click(element);

    expect(onChangeQuantity).toHaveBeenCalledTimes(1);
  });

  it("onChangeQuantity execute with correct arguments", () => {
    const onDelete = jest.fn();
    const onChangeQuantity = jest.fn();
    mockUseMediaQuery.mockReturnValue(true);
    const { getAllByLabelText } = render(
      <ThemeProvider>
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
      </ThemeProvider>
    );

    const element = getAllByLabelText("Up")[5];
    fireEvent.click(element);
    expect(onChangeQuantity).toHaveBeenCalledWith(
      rowsTemplate[0].externalProductCode,
      44
    );
  });
});
