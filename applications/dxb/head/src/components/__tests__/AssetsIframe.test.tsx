import { render, screen } from "@testing-library/react";
import React from "react";
import AssetsIframe from "../AssetsIframe";

describe("AssetsIframe", () => {
  const props = {
    url: "https://example.com/example.mp4",
    title: "Example",
    className: "my-class",
    id: "my-id"
  };
  it("renders an iframe with the correct props", () => {
    const { url, title, id } = props;
    render(<AssetsIframe {...props} />);
    const assetsIframe = screen.queryByTestId("assets-iframe-element");
    expect(assetsIframe).toBeInTheDocument();
    expect(assetsIframe).toHaveAttribute("src", url);
    expect(assetsIframe).toHaveAttribute("title", title);
    expect(assetsIframe).toHaveClass("my-class");
    expect(assetsIframe).toHaveAttribute("id", id);
  });
});
