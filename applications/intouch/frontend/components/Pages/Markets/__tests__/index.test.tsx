import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import Markets from "..";
import { renderWithUserProvider } from "../../../../lib/tests/utils";
import AccountContextWrapper from "../../../../lib/tests/fixtures/account";
import { generateMarketContext } from "../../../../lib/tests/factories/market";

const mockUseUpdateMarketMutation = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  __esModule: true,
  useUpdateMarketMutation: () => [mockUseUpdateMarketMutation]
}));

const markets = [
  generateMarketContext(),
  generateMarketContext({
    id: 1,
    domain: "it",
    language: "IT",
    name: "Mapleland-1"
  })
];

describe("Market page", () => {
  it("should the project in the list", () => {
    const wrapper = renderWithUserProvider(
      <AccountContextWrapper>
        <Markets markets={{ nodes: markets }} />
      </AccountContextWrapper>
    );

    const elements = wrapper.getAllByTestId("list-item");
    expect(elements[0]).toHaveTextContent("Mapleland");
    expect(elements[1]).toHaveTextContent("Mapleland-1");
  });

  it("should open the details", async () => {
    renderWithUserProvider(
      <AccountContextWrapper>
        <Markets markets={{ nodes: markets }} />
      </AccountContextWrapper>
    );

    fireEvent.click(screen.getByText("Mapleland-1"));

    expect(screen.getByTestId("detail-language")).toHaveTextContent("Language");
    expect(screen.getByTestId("value-language")).toHaveTextContent("IT");
  });

  it("should open the editor", async () => {
    renderWithUserProvider(
      <AccountContextWrapper>
        <Markets markets={{ nodes: markets }} />
      </AccountContextWrapper>
    );

    fireEvent.click(screen.getByText("Mapleland-1"));
    fireEvent.click(screen.getByTestId("btn-edit"));

    screen.getByTestId("input-language");
  });

  it("should save the market", async () => {
    renderWithUserProvider(
      <AccountContextWrapper>
        <Markets markets={{ nodes: markets }} />
      </AccountContextWrapper>
    );

    fireEvent.click(screen.getByText("Mapleland-1"));
    fireEvent.click(screen.getByTestId("btn-edit"));

    fireEvent.change(screen.getByDisplayValue("Mapleland-1"), {
      target: {
        value: "New Name"
      }
    });

    fireEvent.click(screen.getByTestId("btn-save"));

    expect(mockUseUpdateMarketMutation).toMatchSnapshot();
  });
});
