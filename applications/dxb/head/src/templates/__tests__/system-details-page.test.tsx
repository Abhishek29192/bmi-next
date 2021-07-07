import React from "react";
import { render } from "@testing-library/react";

import SystemDetailsPage from "../system-details-page";
import { createMockSiteData } from "../../test/mockSiteData";

const systemPageId = "1234";
const siteId = "1234";

jest.mock("gatsby");

describe("SystemDetailsPage template component", () => {
  it("should render", () => {
    const { container } = render(
      <SystemDetailsPage
        data={{
          contentfulSite: createMockSiteData(),
          shareWidget: null
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
