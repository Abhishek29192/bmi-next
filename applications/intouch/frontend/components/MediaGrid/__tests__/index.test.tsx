import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/react";
import { MediaGrid } from "../";
import { renderWithI18NProvider } from "../../../lib/tests/utils";
import { useAccountContext } from "../../../context/AccountContext";
import { useMarketContext } from "../../../context/MarketContext";
import { MediaItem } from "../../../lib/media/types";

const ssoMediaTool: MediaItem = {
  __typename: "MediaTool",
  name: "mediaTool",
  url: "http://www.external.com",
  sys: {
    __typename: "Sys",
    id: "2"
  },
  cta: "MERCHANDISE"
};

jest.mock("../../../context/AccountContext", () => ({
  useAccountContext: jest.fn()
}));
jest.mock("../../../context/MarketContext", () => ({
  useMarketContext: jest.fn()
}));

afterEach(() => {
  jest.restoreAllMocks();
});

describe("MediaGrid", () => {
  beforeEach(() => {
    (useAccountContext as jest.Mock).mockImplementation(() => ({
      account: { id: 1, role: "COMPANY_ADMIN" }
    }));
    (useMarketContext as jest.Mock).mockImplementation(() => ({
      market: { id: 1, merchandiseSso: true }
    }));
  });

  it("should render component", () => {
    const initialProps = {
      isLoading: false,
      items: [ssoMediaTool],
      totalNumItems: 1,
      onMediaItemClick: jest.fn()
    };

    const { container } = renderWithI18NProvider(
      <MediaGrid {...initialProps} />
    );

    expect(container.parentElement).toMatchSnapshot();
  });
  it("should render component with loading animation", () => {
    const initialProps = {
      isLoading: true,
      items: [ssoMediaTool],
      totalNumItems: 1,
      onMediaItemClick: jest.fn()
    };

    renderWithI18NProvider(<MediaGrid {...initialProps} />);

    const circularProgress = screen.getByTestId("circularProgress");
    expect(circularProgress).toBeTruthy();
  });

  it("should render component without items", () => {
    const initialProps = {
      isLoading: false,
      items: [],
      totalNumItems: 0,
      onMediaItemClick: jest.fn()
    };

    renderWithI18NProvider(<MediaGrid {...initialProps} />);

    const noMediaGridItems = screen.getByTestId("noMediaGridItems");
    expect(noMediaGridItems).toBeTruthy();
  });
});
