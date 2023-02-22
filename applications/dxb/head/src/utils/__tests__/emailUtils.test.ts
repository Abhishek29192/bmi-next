import { isValidEmail } from "../emailUtils";

describe("isValidEmail function", () => {
  it("test with valid email", () => {
    expect(isValidEmail("test@gmail.com")).toBeTruthy();
  });

  it("test with invalid email", () => {
    expect(isValidEmail("invalid@")).toBeFalsy();
  });
});
