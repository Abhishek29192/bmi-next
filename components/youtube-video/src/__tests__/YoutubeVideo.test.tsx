import React from "react";
import { render } from "@testing-library/react";
import YoutubeVideo from "../";

describe("YoutubeVideo component", () => {
  it("renders correctly", () => {
    const { container } = render(<YoutubeVideo />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
