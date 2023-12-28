import { isValidEmail, handleEmailValidation } from "../emailUtils";

describe("isValidEmail function", () => {
  it("test with valid email", () => {
    expect(isValidEmail("test@gmail.com")).toBeTruthy();
  });

  it("test with invalid email", () => {
    expect(isValidEmail("invalid@")).toBeFalsy();
  });
});

describe("handleEmailValidation function", () => {
  it("returns false if email contains '@'", () => {
    expect(
      handleEmailValidation("Invalid email error", "test@bmigroup.com")
    ).toBe(false);
  });

  it("returns error message if email does not contain '@'", () => {
    expect(
      handleEmailValidation("Invalid email error", "test-bmigroup.com")
    ).toBe("Invalid email error");
  });
});
