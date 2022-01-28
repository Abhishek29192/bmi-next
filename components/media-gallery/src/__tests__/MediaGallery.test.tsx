import React from "react";
import { render } from "@testing-library/react";
import MediaGallery from "../";

describe("Media Gallery component", () => {
  it("renders correctly", () => {
    const { container } = render(<MediaGallery media={[]} />);
    expect(container).toMatchSnapshot();
  });
});
