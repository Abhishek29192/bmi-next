import React from "react";
import { render } from "@testing-library/react";
import { AuthService } from "@bmi/gatsby-theme-auth0";
import { WindowLocation } from "@reach/router";

import AuthCallback from "../../pages/authCallback";

jest.mock("@bmi/gatsby-theme-auth0", () => ({
  AuthService: {
    handleAuthentication: jest.fn()
  }
}));

describe("AuthCallback Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call AuthService.handleAuthentication when location hash contains relevant tokens", () => {
    const location = {
      hash: "#access_token=token&id_token=idToken"
    } as WindowLocation;

    render(<AuthCallback location={location} />);

    expect(AuthService.handleAuthentication).toHaveBeenCalled();
  });

  it("should not call AuthService.handleAuthentication when location hash does not contain relevant tokens", () => {
    const location = {
      hash: "#other_hash_values"
    } as WindowLocation;

    render(<AuthCallback location={location} />);

    // Ensure that AuthService.handleAuthentication was not called
    expect(AuthService.handleAuthentication).not.toHaveBeenCalled();
  });

  it("should not call AuthService.handleAuthentication when location hash is empty", () => {
    const location = {
      hash: ""
    } as WindowLocation;

    render(<AuthCallback location={location} />);

    expect(AuthService.handleAuthentication).not.toHaveBeenCalled();
  });
});
