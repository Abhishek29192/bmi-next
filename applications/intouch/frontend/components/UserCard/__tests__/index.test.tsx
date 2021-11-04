import React from "react";
import {
  renderWithI18NProvider,
  renderWithUserProvider,
  screen
} from "../../../lib/tests/utils";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";
import { generateAccount } from "../../../lib/tests/factories/account";
import { UserCard } from "..";

describe("UserCard component", () => {
  it("should render null if account is not provided", () => {
    renderWithI18NProvider(
      <UserCard
        testid="user-card"
        onRemoveUser={() => {}}
        companyName="companyName"
        account={null}
        details={[]}
      />
    );
    expect(screen.queryByTestId("user-card")).toBeFalsy();
  });
  describe("change role button", () => {
    it("should render if the user is a member of company", () => {
      const account = generateAccount({ hasCompany: true });
      renderWithUserProvider(
        <AccountContextWrapper
          account={generateAccount({ role: "COMPANY_ADMIN" })}
        >
          <UserCard
            testid="user-card"
            onRemoveUser={() => {}}
            companyName="companyName"
            account={account}
            details={[]}
          />
        </AccountContextWrapper>
      );

      expect(screen.queryByTestId("change-role")).toBeTruthy();
    });
    it("should not render if the user not member of company", () => {
      const account = generateAccount({ hasCompany: false });
      renderWithUserProvider(
        <AccountContextWrapper
          account={generateAccount({ role: "COMPANY_ADMIN" })}
        >
          <UserCard
            testid="user-card"
            onRemoveUser={() => {}}
            companyName="companyName"
            account={account}
            details={[]}
          />
        </AccountContextWrapper>
      );
      expect(screen.queryByTestId("change-role")).toBeFalsy();
    });
    it("should not render if the user super admin", () => {
      const account = generateAccount({
        hasCompany: true,
        role: "SUPER_ADMIN"
      });
      renderWithUserProvider(
        <AccountContextWrapper
          account={generateAccount({ role: "COMPANY_ADMIN" })}
        >
          <UserCard
            testid="user-card"
            onRemoveUser={() => {}}
            companyName="companyName"
            account={account}
            details={[]}
          />
        </AccountContextWrapper>
      );
      expect(screen.queryByTestId("change-role")).toBeFalsy();
    });
  });
});
