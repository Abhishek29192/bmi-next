import { fireEvent } from "@testing-library/react";
import mediaQuery from "css-mediaquery";
import React from "react";
import { renderWithThemeProvider } from "../../__tests__/helper";
import SignupBlock from "../SignupBlock";

const createMatchMedia = (width: number) => {
  return (query: string): MediaQueryList =>
    ({
      matches: mediaQuery.match(query, { width }),
      addListener: () => {},
      removeListener: () => {}
    } as unknown as MediaQueryList);
};
describe("SignupBlock component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <SignupBlock
        title="Lorem ipsum"
        description="Lorem ipsum sit dolor amet"
        inputCallToAction="CTA"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("onSubmit works", async () => {
    const onSubmit = jest.fn();
    const { getByRole } = renderWithThemeProvider(
      <SignupBlock
        title="Lorem ipsum"
        description="Lorem ipsum sit dolor amet"
        inputCallToAction="CTA"
        onSubmit={onSubmit}
      />
    );
    const button = getByRole("button");
    await fireEvent.click(button);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders correctly if buttonComponent is passed", () => {
    const { container } = renderWithThemeProvider(
      <SignupBlock
        title="Lorem ipsum"
        description="Lorem ipsum sit dolor amet"
        inputCallToAction="CTA"
        buttonComponent={() => <button>buttonComponent</button>}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly for large screen", () => {
    window.matchMedia = createMatchMedia(1025);
    const { container } = renderWithThemeProvider(
      <SignupBlock
        title="Lorem ipsum"
        description="Lorem ipsum sit dolor amet"
        inputCallToAction="CTA"
        buttonComponent={() => <button>buttonComponent</button>}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
