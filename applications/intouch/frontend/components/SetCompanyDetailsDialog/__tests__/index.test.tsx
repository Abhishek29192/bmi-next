import React from "react";
import { SetCompanyDetailsDialog } from "..";
import { renderWithUserProvider, screen } from "../../../lib/tests/utils";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";
import MarketContextWrapper from "../../../lib/tests/fixtures/market";

describe("SetCompanyDetailsDialog component", () => {
  it("should show error message", () => {
    const errorMessage = "errorMessage";
    renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <SetCompanyDetailsDialog
            title={"title"}
            isOpen={true}
            onCloseClick={() => {}}
            onSubmit={() => {}}
            errorMessage={errorMessage}
            loading={false}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
