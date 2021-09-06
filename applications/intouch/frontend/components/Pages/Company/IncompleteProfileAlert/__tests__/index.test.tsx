import React from "react";
import {
  act,
  fireEvent,
  renderWithI18NProvider,
  screen,
  waitFor
} from "../../../../../lib/tests/utils";
import { CompanyIncompleteProfileAlert } from "..";

const phoneFieldText = "incompleteProfile.fields.phone";

describe("CompanyIncompleteProfile", () => {
  it("should show missing information", () => {
    renderWithI18NProvider(
      <CompanyIncompleteProfileAlert missingFields={["phone"]} />
    );
    expect(screen.getByText(phoneFieldText)).toBeInTheDocument();
  });

  it("should be dismissable", async () => {
    renderWithI18NProvider(
      <CompanyIncompleteProfileAlert missingFields={["phone"]} />
    );
    expect(screen.getByText(phoneFieldText)).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByTestId("CloseButton"));
    });

    await waitFor(() => {
      expect(screen.queryByText(phoneFieldText)).toBeNull();
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
