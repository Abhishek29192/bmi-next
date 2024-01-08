import { describe, it } from "@jest/globals";
import { config } from "../config";

describe("config", () => {
  it("should default responseType if AUTH0_RESPONSE_TYPE is not set", () => {
    expect(config.responseType).toEqual("token id_token");
  });

  it("should default scope if AUTH0_SCOPE is not set", () => {
    expect(config.scope).toEqual("openid email profile");
  });
});
