import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithUserProvider } from "../../../../lib/tests/utils";
import AccountContextWrapper from "../../../../lib/tests/fixtures/account";
import { MediaPage } from "../index";
import {
  MediaFolder,
  MediaItem,
  RootFolders
} from "../../../../lib/media/types";
import { useMarketContext } from "../../../../context/MarketContext";

jest.mock("../../../../context/MarketContext", () => ({
  useMarketContext: jest.fn()
}));

const mockRouterPush = jest.fn();
jest.mock("next/router", () => {
  const original = jest.requireActual("next/router");
  return {
    ...original,
    useRouter: () => ({
      push: (...params) => mockRouterPush(params)
    })
  };
});

describe("Media page", () => {
  beforeEach(() => {
    (useMarketContext as jest.Mock).mockImplementation(() => ({
      market: { market: "en", optanonClass: "test", merchandiseSso: false }
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const mediaTool: MediaItem = {
    __typename: "MediaTool",
    name: "mediaTool",
    url: "http://www.vimeo.com",
    sys: {
      __typename: "Sys",
      id: "2"
    }
  };

  const mediaToolImg: MediaItem = {
    __typename: "MediaTool",
    name: "mediaTool",
    sys: {
      __typename: "Sys",
      id: "imageId"
    },
    media: {
      url: "",
      contentType: "image",
      sys: {
        __typename: "Sys",
        id: "mediaId"
      }
    }
  };

  const mediaToolPdf: MediaItem = {
    __typename: "MediaTool",
    name: "mediaTool",
    sys: {
      __typename: "Sys",
      id: "pdfId"
    },
    media: {
      url: "",
      contentType: "pdf",
      sys: {
        __typename: "Sys",
        id: "mediaId"
      }
    }
  };

  const mediaToolExternal: MediaItem = {
    __typename: "MediaTool",
    name: "mediaTool",
    url: "http://www.google.com",
    sys: {
      __typename: "Sys",
      id: "googleId"
    }
  };

  const mediaFolder: MediaFolder = {
    __typename: "MediaFolder",
    name: "Megatest",
    sys: {
      id: "2RdhIZRj7BuTDbC2eO2vQp"
    },
    childrenCollection: {
      items: [mediaTool],
      total: 1
    }
  };

  const mediaFolder2: MediaFolder = {
    __typename: "MediaFolder",
    name: "Megatest 2",
    sys: {
      id: "2RdhIZRj7BuуbC2eO2vQp"
    },
    childrenCollection: {
      items: [mediaTool],
      total: 1
    }
  };

  const rootFolders: RootFolders = [
    {
      __typename: "MediaFolder",
      sys: {
        id: "2RdhIZRj7BuTDbC2eO2vQp"
      }
    }
  ];

  it("should render media page", () => {
    const render = renderWithUserProvider(
      <AccountContextWrapper>
        <MediaPage
          mediaFolder={mediaFolder}
          activeMediaId={""}
          mediaPath={[mediaFolder, mediaFolder2]}
          rootFolders={rootFolders}
        />
      </AccountContextWrapper>
    );
    expect(render).toMatchSnapshot();
    fireEvent.click(screen.getByTestId("media-path-navigate"));
    expect(mockRouterPush).toHaveBeenCalledWith([
      `/toolkit/2RdhIZRj7BuTDbC2eO2vQp`
    ]);
  });

  it("emulate click on media item", () => {
    const mediaFolderClick: MediaFolder = {
      __typename: "MediaFolder",
      name: "Megatest",
      sys: {
        id: "2RdhIZRj7BuTDbC2eO2vQp"
      },
      childrenCollection: {
        items: [
          mediaTool,
          mediaFolder2,
          mediaToolExternal,
          mediaToolImg,
          mediaToolPdf
        ],
        total: 3
      }
    };
    renderWithUserProvider(
      <AccountContextWrapper>
        <MediaPage
          mediaFolder={mediaFolderClick}
          activeMediaId={""}
          mediaPath={[mediaFolder, mediaFolder2]}
          rootFolders={rootFolders}
        />
      </AccountContextWrapper>
    );
    fireEvent.click(screen.getByTestId("media-tile-element-2"));
    fireEvent.click(
      screen.getByTestId("media-tile-element-2RdhIZRj7BuуbC2eO2vQp")
    );
    fireEvent.click(screen.getByTestId("media-tile-element-googleId"));
  });

  it("navigate to other tab", () => {
    const rootFoldersTabs: RootFolders = [
      {
        __typename: "MediaFolder",
        sys: {
          id: "2RdhIZRj7BuTDbC2eO2vQp"
        }
      },
      {
        __typename: "MediaFolder",
        sys: {
          id: "3"
        }
      }
    ];
    renderWithUserProvider(
      <AccountContextWrapper>
        <MediaPage
          mediaFolder={mediaFolder}
          activeMediaId={""}
          mediaPath={[mediaFolder, mediaFolder2]}
          rootFolders={rootFoldersTabs}
        />
      </AccountContextWrapper>
    );
    fireEvent.click(screen.getByTestId("tab-3"));
    expect(mockRouterPush).toHaveBeenCalledWith([`/toolkit/3`]);
  });

  it("navigate to missing folder", () => {
    const mediaFolderBroken: MediaFolder = {
      __typename: "MediaFolder",
      name: "Megatest",
      sys: {
        id: null
      },
      childrenCollection: {
        items: [mediaTool],
        total: 1
      }
    };
    renderWithUserProvider(
      <AccountContextWrapper>
        <MediaPage
          mediaFolder={mediaFolderBroken}
          activeMediaId={""}
          mediaPath={[mediaFolderBroken, mediaFolder2]}
          rootFolders={rootFolders}
        />
      </AccountContextWrapper>
    );
    fireEvent.click(screen.getByTestId("media-path-navigate"));
    expect(mockRouterPush).toHaveBeenCalledTimes(0);
  });

  it("should render active media", () => {
    const render = renderWithUserProvider(
      <AccountContextWrapper>
        <MediaPage
          mediaFolder={mediaFolder}
          activeMediaId={"2"}
          mediaPath={[mediaFolder]}
          rootFolders={[]}
        />
      </AccountContextWrapper>
    );
    expect(render).toMatchSnapshot();
    const closeTag = screen.getAllByRole("button")[0].querySelector("svg");
    fireEvent.click(closeTag);
  });

  it("should render no root folders", () => {
    const render = renderWithUserProvider(
      <AccountContextWrapper>
        <MediaPage
          mediaFolder={mediaFolder}
          activeMediaId={""}
          mediaPath={[]}
          rootFolders={null}
        />
      </AccountContextWrapper>
    );
    expect(render).toMatchSnapshot();
  });
});
