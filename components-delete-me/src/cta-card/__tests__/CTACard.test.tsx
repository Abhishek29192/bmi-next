import React from "react";
import { fireEvent } from "@testing-library/react";
import { ButtonBaseProps } from "@material-ui/core";
import CTACard from "../CTACard";
import { renderWithThemeProvider } from "../../__tests__/helper";
import demoHouseImage from "./images/demo-tiles.jpg";

describe("CtaCard component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <CTACard
        title="Call to Action Card"
        media={<img src={demoHouseImage} alt="Lorem ipsum" />}
        action={{ model: "htmlLink", href: "#" }}
        className="test-className"
        clickableArea="full"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with custom button", () => {
    const { container } = renderWithThemeProvider(
      <CTACard
        title="Call to Action Card"
        buttonComponent={(props: ButtonBaseProps) => (
          <button data-testid="custom-button" {...props} />
        )}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with the clickable area around the heading", () => {
    const { container } = renderWithThemeProvider(
      <CTACard
        title="Call to Action Card"
        clickableArea="heading"
        media={<img src={demoHouseImage} alt="Lorem ipsum" />}
        action={{ model: "htmlLink", href: "#" }}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("should handle library props from ButtonBaseProps", () => {
    const onClick = jest.fn();
    const { getByText } = renderWithThemeProvider(
      <CTACard title="Call to Action Card" onClick={onClick} />
    );
    fireEvent.click(getByText("Call to Action Card"));
    expect(onClick).toBeCalledTimes(1);
  });
});
