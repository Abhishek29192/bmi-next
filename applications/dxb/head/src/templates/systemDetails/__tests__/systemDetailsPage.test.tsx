import React from "react";
import { renderWithRouter } from "../../../test/renderWithRouter";
import { createMockSiteData } from "../../../test/mockSiteData";
import SystemDetailsPage from "../systemDetailsPage";
import { systemDetailsMockData } from "../../../test/systemDetailsMockData";
import "@testing-library/jest-dom";

const systemPageId = "1234";
const siteId = "1234";

jest.mock("gatsby");

describe("SystemDetailsPage template component", () => {
  it("should render", () => {
    process.env.GATSBY_ENABLE_BRAND_PROVIDER = "true";
    process.env.SPACE_MARKET_CODE = "no";
    const { container } = renderWithRouter(
      <SystemDetailsPage
        data={{
          contentfulSite: createMockSiteData(),
          shareWidget: null,
          dataJson: systemDetailsMockData
        }}
        pageContext={{
          systemPageId,
          siteId
        }}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it("should render without BrandProvider", () => {
    process.env.SPACE_MARKET_CODE = "no";
    const { container } = renderWithRouter(
      <SystemDetailsPage
        data={{
          contentfulSite: createMockSiteData(),
          shareWidget: null,
          dataJson: systemDetailsMockData
        }}
        pageContext={{
          systemPageId,
          siteId
        }}
      />
    );
    const tabSection = container.querySelector(".TabsBar");

    expect(container).toMatchSnapshot();
    expect(tabSection).toBeInTheDocument();
  });
});
