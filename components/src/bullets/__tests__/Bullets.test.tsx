import React from "react";
import Bullets from "../Bullets";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("Bullets component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <Bullets>
        <Bullets.Item>First Item.</Bullets.Item>
        <Bullets.Item>Second Item.</Bullets.Item>
      </Bullets>
    );
    expect(container).toMatchSnapshot();
  });
});
