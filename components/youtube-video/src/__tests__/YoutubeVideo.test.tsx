import React from "react";
import { render } from "@testing-library/react";
import YoutubeVideo from "../";

describe("YoutubeVideo component", () => {
  it("renders in dialog layout correctly", () => {
    const props = {
      label: "test video",
      videoId: "A-RfHC91Ewc",
      embedWidth: 1280,
      embedHeight: 720
    };
    const { container } = render(<YoutubeVideo layout="dialog" {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders in in-place layout correctly", () => {
    const props = {
      label: "test video",
      videoId: "A-RfHC91Ewc",
      embedWidth: 1280,
      embedHeight: 720
    };
    const { container } = render(<YoutubeVideo layout="in-place" {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders inline layout correctly", () => {
    const props = {
      label: "test inline video",
      videoId: "A-RfHC91Ewc",
      embedWidth: 1280,
      embedHeight: 720
    };
    const { container } = render(<YoutubeVideo layout="inline" {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("opens dialog on click", () => {
    const props = {
      label: "test video",
      videoId: "A-RfHC91Ewc",
      embedWidth: 1280,
      embedHeight: 720
    };
    const { container, getByRole } = render(
      <YoutubeVideo layout="dialog" {...props} />
    );
    const thumbnailButton = getByRole("button", { name: props.label });
    thumbnailButton.click();
    expect(container.parentElement).toMatchSnapshot();
  });
});
