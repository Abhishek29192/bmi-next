import React from "react";
import Bullets from "../";
import { render } from "@testing-library/react";

describe("Bullets component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Bullets>
        <Bullets.Item>First Item.</Bullets.Item>
        <Bullets.Item>Second Item.</Bullets.Item>
      </Bullets>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
