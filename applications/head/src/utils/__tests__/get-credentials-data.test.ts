import getCredentialsData from "../get-credentials-data";

describe("getCredentialsData function", () => {
  it("returns a single space", () => {
    const mockEnv = {
      SPACE_ID: "YYYYYYYYYYYYY",
      ACCESS_TOKEN: "XXXXXXXXXXXXXXXXXXXXXXX"
    };

    expect(getCredentialsData(mockEnv)).toMatchSnapshot();
  });
  it("returns multiple spaces", () => {
    const mockEnv = {
      SPACE_ID: "YYYYYYYYYYYYY",
      ACCESS_TOKEN: "XXXXXXXXXXXXXXXXXXXXXXX",
      SPACE_ID_1: "ZZZZZZZZZZZZ",
      ACCESS_TOKENN: "NNNNNNNNNNNNNNNNNNNNNNN"
    };

    expect(getCredentialsData(mockEnv)).toMatchSnapshot();
  });
  it("throws an error if no credentials are set", () => {
    const mockEnv = {
      NODE_ENV: "testing"
    };

    expect(() => getCredentialsData(mockEnv)).toThrowErrorMatchingSnapshot();
  });
});
