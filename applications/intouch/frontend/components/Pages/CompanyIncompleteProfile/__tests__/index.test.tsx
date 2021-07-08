import React from "react";
import {
  act,
  fireEvent,
  renderWithI18NProvider,
  screen,
  waitFor
} from "../../../../lib/tests/utils";
import { CompanyIncompleteProfileAlert } from "..";

describe("CompanyIncompleteProfile", () => {
  it("should show missing information", () => {
    renderWithI18NProvider(
      <CompanyIncompleteProfileAlert missingFields={["phone"]} />
    );
    expect(screen.getByText("Phone")).toBeInTheDocument();
  });

  it("should be dismissable", async () => {
    renderWithI18NProvider(
      <CompanyIncompleteProfileAlert missingFields={["phone"]} />
    );
    expect(screen.getByText("Phone")).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByTestId("CloseButton"));
    });

    await waitFor(() => {
      expect(screen.queryByText("Phone")).toBeNull();
    });
  });

  it("should match snapshot", () => {
    const { container } = renderWithI18NProvider(
      <CompanyIncompleteProfileAlert
        missingFields={["phone", "aboutUs", "tradingAddress"]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
