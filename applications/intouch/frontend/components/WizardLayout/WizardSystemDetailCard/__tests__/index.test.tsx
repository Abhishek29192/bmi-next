import React, { useRef } from "react";
import { Product } from "@bmi/intouch-api-types";
import { fireEvent, render, screen } from "../../../../lib/tests/utils";
import { WizardSystemDetailCard } from "..";

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
      <WizardSystemDetailCard
        name="name"
        description="description"
        products={[]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("should render with  products", () => {
    const { container } = render(
      <WizardSystemDetailCard
        name="name"
        description="description"
        products={products}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("should render with onDelete", () => {
    const { container } = render(
      <WizardSystemDetailCard
        name="name"
        description="description"
        products={products}
        onDeleteClick={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("should trigger onDelete", () => {
    const mockCallBack = jest.fn();
    render(
      <WizardSystemDetailCard
        name="name"
        description="description"
        products={products}
        onDeleteClick={mockCallBack}
      />
    );
    const deleteSystem = screen.getByTestId("system-delete");
    fireEvent.click(deleteSystem);
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });
});
