import React from "react";
import NewsLetterSignUp from "../NewsLetterSignUp";
import { render } from "@testing-library/react";

describe("NewsLetterSignUp component", () => {
  it("renders correctly", () => {
    const data = {
      signUpTitle: "Title",
      signUpDescription: {
        signUpDescription: "Description"
      },
      signUpInputLabel: "Label",
      signUpCallToAction: "Call to action"
    };

    const { container } = render(<NewsLetterSignUp data={data} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
