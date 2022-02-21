import React from "react";
import { render } from "@testing-library/react";
import Bullets from "../Bullets";

describe("Bullets component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Bullets>
        <Bullets.Item>First Item.</Bullets.Item>
        <Bullets.Item>Second Item.</Bullets.Item>
      </Bullets>
    );
    expect(container).toMatchSnapshot();
  });
});
