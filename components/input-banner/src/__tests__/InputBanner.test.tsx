import React from "react";
import { fireEvent, render } from "@testing-library/react";
import InputBanner from "../";

describe("InputBanner component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <InputBanner
        title="Lorem ipsum"
        description="Lorem ipsum sit dolor amet"
        inputLabel="Label"
        inputCallToAction="CTA"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("onSubmit works", async () => {
    const onSubmit = jest.fn();
    const { getByRole, debug } = render(
      <InputBanner
        title="Lorem ipsum"
        description="Lorem ipsum sit dolor amet"
        inputLabel="Label"
        inputCallToAction="CTA"
        onSubmit={onSubmit}
      />
    );
    const input = getByRole("textbox");
    const button = getByRole("button");
    const mockTypingEvent = {
      target: {
        value: "test@email.com"
      }
    };
    await fireEvent.change(input, mockTypingEvent);
    await fireEvent.click(button);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
