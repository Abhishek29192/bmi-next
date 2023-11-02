import React from "react";
import { render, screen } from "@testing-library/react";
import { AuthService } from "@bmi/gatsby-theme-auth0";

import ProtectedPage from "../../pages/protected";

const mockUseAuth = jest.fn();
jest.mock("@bmi/gatsby-theme-auth0", () => ({
  useAuth: (args) => mockUseAuth(args),
  AuthService: {
    login: jest.fn(),
    logout: jest.fn()
  }
}));

describe("ProtectedPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render children when user is logged in", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      profile: { name: "User" }
    });

    render(
      <ProtectedPage>
        <div>Protected Content</div>
      </ProtectedPage>
    );

    expect(screen.getByText("Protected Content")).toBeTruthy();
    expect(AuthService.login).not.toHaveBeenCalled();
  });

  it("should call AuthService.login when user is not logged in", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: false, profile: null });

    render(
      <ProtectedPage>
        <div>Protected Content</div>
      </ProtectedPage>
    );
    expect(AuthService.login).toHaveBeenCalled();
    expect(screen.queryByText("Protected Content")).toBeNull();
  });
});
