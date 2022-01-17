import { isValidEmail } from "../emailUtils";

describe("isValidEmail function", () => {
  it("test with valid email", () => {
    expect(isValidEmail("test@gmail.com")).toBeTruthy();
  });

  it("test with null", () => {
    expect(isValidEmail(null)).toBeFalsy();
  });

  it("test with invalid email", () => {
    expect(isValidEmail("invalid@")).toBeFalsy();
  });

  it("test with empty email", () => {
    expect(isValidEmail("")).toBeFalsy();
  });
});
