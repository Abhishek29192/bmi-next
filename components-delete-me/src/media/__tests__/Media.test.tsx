import React from "react";
import { render, fireEvent, createEvent } from "@testing-library/react";
import YoutubeVideo from "../../youtube-video/YoutubeVideo";
import Media from "../Media";

describe("Media component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Media>
        <img />
      </Media>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with className", () => {
    const { container } = render(
      <Media className="test">
        <img />
      </Media>
    );
    expect(container).toMatchSnapshot();
  });

  it("returns null if has no children", () => {
    const { container } = render(<Media />);
    expect(container.firstChild).toBe(null);
  });

  it("renders correctly if child is not img or YoutubeVideo", () => {
    const { container } = render(
      <Media>
        <p>text</p>
      </Media>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if size is not cover", () => {
    const { container } = render(
      <Media size="contain">
        <img />
      </Media>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if child youtube video", () => {
    const { container } = render(
      <Media size="contain">
        <YoutubeVideo
          label="label"
          videoId="youtubeId"
          embedHeight={500}
          embedWidth={900}
        />
      </Media>
    );
    expect(container).toMatchSnapshot();
  });

  it("should prevent drag event if child.type is img and isDragEnabled is false", async () => {
    const { container } = render(
      <Media isDragEnabled={false}>
        <img />
      </Media>
    );

    const myEvent = createEvent.dragStart(container.firstChild!);
    myEvent.preventDefault = jest.fn();

    fireEvent(container.firstChild!, myEvent);

    expect(myEvent.preventDefault).toHaveBeenCalledTimes(1);
  });

  it("should prevent drag event if child.type is img and isDragEnabled is undefined", async () => {
    const { container } = render(
      <Media>
        <img />
      </Media>
    );

    const myEvent = createEvent.dragStart(container.firstChild!);
    myEvent.preventDefault = jest.fn();

    fireEvent(container.firstChild!, myEvent);

    expect(myEvent.preventDefault).toHaveBeenCalledTimes(1);
  });

  it("should not prevent drag event if child.type is img and isDragEnabled is true", async () => {
    const { container } = render(
      <Media isDragEnabled>
        <img />
      </Media>
    );

    const myEvent = createEvent.dragStart(container);
    myEvent.preventDefault = jest.fn();

    fireEvent(container, myEvent);

    expect(myEvent.preventDefault).toHaveBeenCalledTimes(0);
  });
});
