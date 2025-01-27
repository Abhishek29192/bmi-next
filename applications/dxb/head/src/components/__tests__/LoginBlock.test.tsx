import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import AuthService from "../../auth/service";
import createAuth0IdTokenPayload from "../../templates/myAccountPage/__tests__/helpers/Auth0IdTokenPayloadHelper";
import LoginBlock from "../LoginBlock";
import { SiteContextProvider } from "../Site";
import { getMockSiteContext } from "./utils/SiteContextProvider";
import type { useAuthType } from "../../hooks/useAuth";

const mockUseAuth = jest.fn<useAuthType, [useAuthType]>();
jest.mock("../../hooks/useAuth", () => ({
  __esModule: true,
  default: (args: useAuthType) => mockUseAuth(args)
}));
jest.mock("../../auth/service", () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    logout: jest.fn()
  }
}));

beforeEach(() => {
  jest.clearAllMocks();
});
describe("LoginBlock Component", () => {
  it("renders the LoginBlock component when not logged in", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      isLoading: false,
      profile: undefined
    });
    render(
      <ThemeProvider>
        <LoginBlock />
      </ThemeProvider>
    );

    expect(screen.getByText("MC: login.label.btn")).toBeInTheDocument();
    expect(screen.queryByText("MC: my.account.label")).not.toBeInTheDocument();
    expect(screen.queryByText("MC: logout.label.btn")).not.toBeInTheDocument();
  });

  it("renders the LoginBlock component when logged in", () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isLoggedIn: true,
      profile: createAuth0IdTokenPayload()
    });
    render(
      <ThemeProvider>
        <LoginBlock />
      </ThemeProvider>
    );

    expect(screen.getByText("MC: my.account.label")).toBeInTheDocument();
    expect(screen.getByText("MC: logout.label.btn")).toBeInTheDocument();
    expect(screen.queryByText("MC: login.label.btn")).not.toBeInTheDocument();
  });

  it("redirects to my acc page", () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isLoggedIn: true,
      profile: createAuth0IdTokenPayload()
    });
    render(
      <ThemeProvider>
        <SiteContextProvider
          value={{
            ...getMockSiteContext("no"),
            accountPage: { slug: "account" }
          }}
        >
          <LoginBlock />
        </SiteContextProvider>
      </ThemeProvider>
    );

    expect(screen.getByText("MC: my.account.label")).toBeInTheDocument();
    expect(screen.getByText("MC: logout.label.btn")).toBeInTheDocument();
    const myAccBtn = screen.getByText("MC: my.account.label");
    fireEvent.click(myAccBtn);
    expect(myAccBtn).toHaveAttribute(
      "href",
      expect.stringContaining(`account`)
    );
  });

  // this test case will be valid in Phase 3
  // it("calls AuthService.login when Login button is clicked", () => {
  //   mockUseAuth.mockReturnValue({
  //     isLoading: false,
  //     isLoggedIn: false,
  //     profile: {
  //       name: "User",
  //       nickname: "",
  //       picture: "",
  //       user_id: "",
  //       clientID: "",
  //       identities: [],
  //       created_at: "",
  //       updated_at: "",
  //       sub: ""
  //     }
  //   });
  //   render(
  //     <ThemeProvider>
  //       <LoginBlock />
  //     </ThemeProvider>
  //   );
  //
  //   const loginButton = screen.getByText("MC: login.label.btn");
  //   fireEvent.click(loginButton);
  //   expect(AuthService.login).toHaveBeenCalled();
  // });

  it("calls AuthService.logout when Logout button is clicked", () => {
    // Update the mock for useAuth to indicate that the user is logged in
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isLoggedIn: true,
      profile: createAuth0IdTokenPayload()
    });
    render(
      <ThemeProvider>
        <LoginBlock />
      </ThemeProvider>
    );

    const logoutButton = screen.getByText("MC: logout.label.btn");
    fireEvent.click(logoutButton);

    expect(AuthService.logout).toHaveBeenCalled();
  });

  it("calls AuthService.login when Login button is clicked", () => {
    process.env.NEXT_PUBLIC_INTOUCH_ORIGIN =
      "https://dev-en.intouch.bmigroup.com/";
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isLoggedIn: false,
      profile: createAuth0IdTokenPayload()
    });
    render(
      <ThemeProvider>
        <LoginBlock />
      </ThemeProvider>
    );

    const loginButton = screen.getByText("MC: login.label.btn");
    fireEvent.click(loginButton);
    expect(AuthService.login).toHaveBeenCalled();
  });
});
