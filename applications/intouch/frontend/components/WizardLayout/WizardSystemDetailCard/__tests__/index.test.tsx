import { ThemeProvider } from "@bmi/components";
import { Product } from "@bmi/intouch-api-types";
import React, { useRef } from "react";
import { WizardSystemDetailCard } from "..";
import { fireEvent, render, screen } from "../../../../lib/tests/utils";

jest.mock("@bmi-digital/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));
describe("WizardSystemDetailCard", () => {
  const products = [
    { id: 1, name: "name", family: "family", brand: "brand" },
    { id: 2, name: "name", family: "family", brand: "brand" },
    { id: 3, name: "name", family: "family", brand: "brand" },
    { id: 4, name: "name", family: "family", brand: "brand" }
  ] as Product[];
  it("should render with no products", () => {
    const { container } = render(
      <ThemeProvider>
        <WizardSystemDetailCard
          name="name"
          description="description"
          products={[]}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should render with  products", () => {
    const { container } = render(
      <ThemeProvider>
        <WizardSystemDetailCard
          name="name"
          description="description"
          products={products}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should render with onDelete", () => {
    const { container } = render(
      <ThemeProvider>
        <WizardSystemDetailCard
          name="name"
          description="description"
          products={products}
          onDeleteClick={() => {}}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should trigger onDelete", () => {
    const mockCallBack = jest.fn();
    render(
      <ThemeProvider>
        <WizardSystemDetailCard
          name="name"
          description="description"
          products={products}
          onDeleteClick={mockCallBack}
        />
      </ThemeProvider>
    );
    const deleteSystem = screen.getByTestId("system-delete");
    fireEvent.click(deleteSystem);
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });
});
