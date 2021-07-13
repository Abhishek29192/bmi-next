import React from "react";
import { renderWithRouter } from "../../test/renderWithRouter";

import SystemDetailsPage from "../system-details-page";
import { createMockSiteData } from "../../test/mockSiteData";
import dataJson from "../../data/pim-mock-data.json";
import { SystemDetails } from "../system-details/system-details-utils";

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

    expect(container).toMatchSnapshot();
  });
});
