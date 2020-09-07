import { languages } from "@bmi/language-selection";
import { render } from "@testing-library/react";
import React from "react";
import LanguageSelection from "../";

describe("LanguageSelection component", () => {
  it("renders correctly", () => {
    const { container } = render(<LanguageSelection languages={languages} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
