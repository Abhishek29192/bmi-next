import React from "react";
import { renderWithRouter } from "../../../test/renderWithRouter";
import { createMockSiteData } from "../../../test/mockSiteData";
import dataJson from "../../../data/pim-mock-data.json";
import SystemDetailsPage from "../systemDetailsPage";
import { SystemDetails } from "../types";
import "@testing-library/jest-dom";

const systemPageId = "1234";
const siteId = "1234";

jest.mock("gatsby");

describe("SystemDetailsPage template component", () => {
  it("should render", () => {
    const { container } = renderWithRouter(
      <SystemDetailsPage
        data={{
          contentfulSite: createMockSiteData(),
          shareWidget: null,
          dataJson: dataJson as SystemDetails
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
