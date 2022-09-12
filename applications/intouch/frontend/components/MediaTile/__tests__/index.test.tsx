import React from "react";
import { render, screen, fireEvent } from "../../../lib/tests/utils";
import { MediaItem } from "../../../lib/media/types";
import { META_TYPES } from "../../../lib/media/utils";
import { MediaTile } from "../";
import { generateAccount } from "../../../lib/tests/factories/account";

const onMediaItemClickMock = jest.fn();

describe("MediaTile", () => {
  const mediaFolder = (): MediaItem => ({
    __typename: "MediaFolder",
    name: "mediaFolder",
    sys: {
      __typename: "Sys",
      id: "1"
    }
  });
  const mediaTool = (): MediaItem => ({
    __typename: "MediaTool",
    name: "mediaTool",
    url: "http://www.external.com",
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
  const SsoMediaTool: MediaItem = {
    __typename: "MediaTool",
    name: "mediaTool",
    url: "http://www.external.com",
    sys: {
      __typename: "Sys",
      id: "2"
    },
    cta: "MERCHANDISE"
  };

  const account = generateAccount({ role: "SUPER_ADMIN" });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("render mediaFolder correctly", async () => {
    const initialProps = mediaFolder();
    const { container } = render(
      <MediaTile
        mediaItem={initialProps}
        onMediaItemClick={onMediaItemClickMock}
        account={account}
        merchandiseSso={true}
      />
    );

    expect(screen.getByText("mediaFolder")).toBeTruthy();
    expect(screen.getByText(`contentTypes.${META_TYPES.FOLDER}`)).toBeTruthy();

    fireEvent.click(container.querySelector("svg"));

    expect(onMediaItemClickMock).toHaveBeenCalledTimes(1);
  });

  it("render mediaTool correctly", async () => {
    const initialProps = mediaTool();
    const { container } = render(
      <MediaTile
        mediaItem={initialProps}
        onMediaItemClick={onMediaItemClickMock}
        account={account}
        merchandiseSso={true}
      />
    );

    expect(screen.getByText("mediaTool")).toBeTruthy();
    expect(
      screen.getByText(`100 Bytes • contentTypes.${META_TYPES.EXTERNAL_LINK}`)
    ).toBeTruthy();
    expect(
      container.querySelector(`[href='${(initialProps as any).url}']`)
    ).toBeTruthy();

    fireEvent.click(container.querySelector("svg"));

    expect(onMediaItemClickMock).toHaveBeenCalledTimes(1);
  });

  describe("Able to click on", () => {
    it("name", async () => {
      const initialProps = mediaFolder();
      render(
        <MediaTile
          mediaItem={initialProps}
          onMediaItemClick={onMediaItemClickMock}
          account={account}
          merchandiseSso={true}
        />
      );
      fireEvent.click(screen.getByText("mediaFolder"));

      expect(onMediaItemClickMock).toHaveBeenCalledTimes(1);
    });

    it("description", async () => {
      const initialProps = mediaFolder();
      render(
        <MediaTile
          mediaItem={initialProps}
          onMediaItemClick={onMediaItemClickMock}
          account={account}
          merchandiseSso={true}
        />
      );
      fireEvent.click(screen.getByText(`contentTypes.${META_TYPES.FOLDER}`));

      expect(onMediaItemClickMock).toHaveBeenCalledTimes(1);
    });

    it("check merchandise cta for SUPER_ADMIN", async () => {
      render(
        <MediaTile
          mediaItem={SsoMediaTool}
          onMediaItemClick={onMediaItemClickMock}
          account={account}
          merchandiseSso={true}
        />
      );

      expect(screen.getByText("mediaTool")).toBeTruthy();
    });

    it("check merchandise cta for INSTALLER", async () => {
      render(
        <MediaTile
          mediaItem={SsoMediaTool}
          onMediaItemClick={onMediaItemClickMock}
          account={generateAccount({ role: "INSTALLER" })}
          merchandiseSso={true}
        />
      );

      expect(screen.getByText("mediaTool")).toBeTruthy();
    });
  });
});
