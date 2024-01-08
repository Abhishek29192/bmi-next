import { WindowLocation } from "@reach/router";
import { render } from "@testing-library/react";
import React from "react";
import AuthService from "../../auth/service";

import AuthCallback from "../../pages/auth/callback";

jest.mock("../../auth/service", () => ({
  __esModule: true,
  default: {
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
