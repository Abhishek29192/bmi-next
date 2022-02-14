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
    expect(container).toMatchSnapshot();
  });

  it("onSubmit works", async () => {
    const onSubmit = jest.fn();
    const { getByRole } = render(
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

  it("handleSubmit is called if Enter pressed and email not valid", async () => {
    const onSubmit = jest.fn();
    const { getByRole } = render(
      <InputBanner
        title="Lorem ipsum"
        description="Lorem ipsum sit dolor amet"
        inputLabel="Label"
        inputCallToAction="CTA"
        onSubmit={onSubmit}
      />
    );
    const input = getByRole("textbox");
    const mockTypingEvent = {
      target: {
        value: "com"
      }
    };
    const mockEnter = { key: "Enter", code: 13, charCode: 13 };
    await fireEvent.change(input, mockTypingEvent);
    await fireEvent.keyDown(input, mockEnter);
    expect(onSubmit).toHaveBeenCalledTimes(0);
  });

  it("onKeyDown does not trigger onSubmit if Enter not pressed", async () => {
    const onSubmit = jest.fn();
    const { getByRole } = render(
      <InputBanner
        title="Lorem ipsum"
        description="Lorem ipsum sit dolor amet"
        inputLabel="Label"
        inputCallToAction="CTA"
        onSubmit={onSubmit}
      />
    );
    const input = getByRole("textbox");
    const mockTypingEvent = {
      target: {
        value: "test@email.com"
      }
    };
    const mockEnter = { key: "Space", code: 32, charCode: 32 };
    await fireEvent.change(input, mockTypingEvent);
    await fireEvent.keyDown(input, mockEnter);
    expect(onSubmit).toHaveBeenCalledTimes(0);
  });

  it("renders correctly if inputGroupSuffix is passed", () => {
    const { container } = render(
      <InputBanner
        title="Lorem ipsum"
        description="Lorem ipsum sit dolor amet"
        inputLabel="Label"
        inputCallToAction="CTA"
        inputGroupSuffix={<div>inputGroupSuffix</div>}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if buttonComponent is passed", () => {
    const { container } = render(
      <InputBanner
        title="Lorem ipsum"
        description="Lorem ipsum sit dolor amet"
        inputLabel="Label"
        inputCallToAction="CTA"
        buttonComponent={() => <button>buttonComponent</button>}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
