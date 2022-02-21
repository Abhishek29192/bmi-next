import { fireEvent, render } from "@testing-library/react";
import React from "react";
import GeolocationButton from "../GeolocationButton";

describe("GeolocationButton component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <GeolocationButton onPosition={() => {}}>
        Use my location
      </GeolocationButton>
    );
    expect(container).toMatchSnapshot();
  });
  it("calls onPosition on click", () => {
    const onPosition = jest.fn();
    const { getByText } = render(
      <GeolocationButton onPosition={onPosition}>
        Use my location
      </GeolocationButton>
    );
    const button = getByText("Use my location");
    fireEvent.click(button);
    expect(onPosition.mock.calls).toMatchSnapshot();
  });
});
