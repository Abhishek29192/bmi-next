import { render, screen } from "@testing-library/react";
import React from "react";
import AuthService from "../../auth/service";

import ProtectedPage from "../../pages/protected";

const mockUseAuth = jest.fn();
jest.mock("../../hooks/useAuth", () => ({
  __esModule: true,
  default: (args) => mockUseAuth(args)
}));
jest.mock("../../auth/service", () => ({
  __esModule: true,
  default: {
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
