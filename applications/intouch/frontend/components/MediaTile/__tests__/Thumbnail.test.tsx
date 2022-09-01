import React from "react";
import { MediaTileThumbnail } from "../Thumbnail";
import { renderWithI18NProvider } from "../../../lib/tests/utils";
import { MediaItem } from "../../../lib/media/types";

const mediaItem = (): MediaItem => ({
  __typename: "MediaFolder",
  name: "mediaFolder",
  sys: {
    __typename: "Sys",
    id: "1"
  }
});

const mediaThumbnail = (): MediaItem => ({
  __typename: "MediaTool",
  name: "mediaThumbnail",
  sys: {
    __typename: "Sys",
    id: "2"
  },
  thumbnail: {
    __typename: "Asset",
    title: "mediaAsset",
    url: "http://www.external.com",
    sys: {
      __typename: "Sys",
      id: "2"
    }
  }
});

const mediaTool = (url: string): MediaItem => ({
  __typename: "MediaTool",
  name: "mediaTool",
  url: url,
  sys: {
    __typename: "Sys",
    id: "2"
  },
  media: {
    __typename: "Asset",
    title: "mediaAsset",
    description: "mediaAsset description",
    size: 100,
    sys: {
      __typename: "Sys",
      id: "2"
    }
  }
});

describe("MediaTileThumbnail", () => {
  it("should render component", () => {
    const { container } = renderWithI18NProvider(
      <MediaTileThumbnail mediaItem={mediaItem()} />
    );

    expect(container.parentElement).toMatchSnapshot();
  });

  it("should render mediaThumbnail component", () => {
    const { container } = renderWithI18NProvider(
      <MediaTileThumbnail mediaItem={mediaThumbnail()} />
    );

    expect(container.parentElement).toMatchSnapshot();
  });

  it("should render vimeo MediaTool component", () => {
    const { container } = renderWithI18NProvider(
      <MediaTileThumbnail mediaItem={mediaTool("http://vimeo.com")} />
    );

    expect(container.parentElement).toMatchSnapshot();
  });

  it("should render not vimeo MediaTool component", () => {
    const { container } = renderWithI18NProvider(
      <MediaTileThumbnail mediaItem={mediaTool(null)} />
    );

    expect(container.parentElement).toMatchSnapshot();
  });
});
