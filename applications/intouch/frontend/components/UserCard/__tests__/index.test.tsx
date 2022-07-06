import React from "react";
import {
  renderWithI18NProvider,
  renderWithUserProvider,
  screen,
  fireEvent
} from "../../../lib/tests/utils";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";
import { generateAccount } from "../../../lib/tests/factories/account";
import { UserCard } from "..";

const onAccountUpdateSpy = jest.fn();

describe("UserCard component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should render null if account is not provided", () => {
    renderWithI18NProvider(
      <AccountContextWrapper>
        <UserCard
          testid="user-card"
          onRemoveUser={() => {}}
          companyName="companyName"
          account={null}
          details={[]}
        />
      </AccountContextWrapper>
    );
    expect(screen.queryByTestId("user-card")).toBeFalsy();
  });
  describe("change role button", () => {
    it("should render if the account is a member of company", () => {
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

    it("should not render if the account is not member of company", () => {
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

    it("should not render if the account super admin", () => {
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

  describe("change role auditor", () => {
    it("should render if account role is auditor", () => {
      const account = generateAccount({ hasCompany: false });
      renderWithUserProvider(
        <AccountContextWrapper
          account={generateAccount({ role: "SUPER_ADMIN" })}
        >
          <UserCard
            testid="user-card"
            onRemoveUser={() => {}}
            companyName="companyName"
            account={account}
            details={[]}
            onAccountUpdate={onAccountUpdateSpy}
          />
        </AccountContextWrapper>
      );

      expect(screen.queryByTestId("change-role-auditor")).toBeTruthy();

      const button = screen.queryByText("user_card.add_auditor");
      fireEvent.click(button);

      expect(screen.queryByText("user_card.role_dialog.title")).toBeTruthy();
      const dialogButton = screen.queryByText("user_card.confirm");
      fireEvent.click(dialogButton);

      expect(onAccountUpdateSpy).toHaveBeenCalledWith(1, "AUDITOR");
    });

    it("should render if account role is auditor but not a company member", () => {
      const account = generateAccount({ role: "AUDITOR", hasCompany: false });
      renderWithUserProvider(
        <AccountContextWrapper
          account={generateAccount({ role: "SUPER_ADMIN" })}
        >
          <UserCard
            testid="user-card"
            onRemoveUser={() => {}}
            companyName="companyName"
            account={account}
            details={[]}
            onAccountUpdate={onAccountUpdateSpy}
          />
        </AccountContextWrapper>
      );

      expect(screen.queryByTestId("change-role-auditor")).toBeTruthy();

      const button = screen.queryByText("user_card.remove_auditor");
      fireEvent.click(button);

      expect(screen.queryByText("user_card.role_dialog.title")).toBeTruthy();
      const dialogButton = screen.queryByText("user_card.confirm");
      fireEvent.click(dialogButton);

      expect(onAccountUpdateSpy).toHaveBeenCalledWith(1, "INSTALLER");
    });

    it("should not render if the account is a comapny member", () => {
      const account = generateAccount({
        hasCompany: true
      });
      renderWithUserProvider(
        <AccountContextWrapper
          account={generateAccount({ role: "SUPER_ADMIN" })}
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
      expect(screen.queryByTestId("change-role-auditor")).toBeFalsy();
    });
  });
});
