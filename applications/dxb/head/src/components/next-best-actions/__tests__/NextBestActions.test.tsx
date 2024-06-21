import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render, screen } from "@testing-library/react";
import React from "react";
import { SiteContextProvider } from "../../Site";
import { getMockSiteContext } from "../../__tests__/utils/SiteContextProvider";
import NextBestActions from "../NextBestActions";
import createPromoData from "../../../__tests__/helpers/PromoHelper";
import createPageInfoData from "../../../__tests__/helpers/PageInfoHelper";
import { createInternalLinkData } from "../../../__tests__/helpers/LinkHelper";

describe("NextBestActions component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <SiteContextProvider value={getMockSiteContext()}>
          <NextBestActions
            data={[
              createPromoData(),
              createPageInfoData({
                cta: createInternalLinkData(),
                subtitle: "example-nba-subtitle"
              })
            ]}
          />
        </SiteContextProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  describe("Title", () => {
    it("should render the title prop as the NBA Card title, if the data type is ContentfulPromo amd title prop is defined", () => {
      render(
        <ThemeProvider>
          <SiteContextProvider value={getMockSiteContext()}>
            <NextBestActions
              data={[createPromoData({ title: "example-nba-title" })]}
            />
          </SiteContextProvider>
        </ThemeProvider>
      );

      expect(screen.getByTestId("tappable-card-body-title")).toHaveTextContent(
        "example-nba-title"
      );
    });

    it("should render the name prop as the NBA Card title, if the data type is ContentfulPromo and the title prop is undefined", () => {
      render(
        <ThemeProvider>
          <SiteContextProvider value={getMockSiteContext()}>
            <NextBestActions
              data={[
                createPromoData({ title: null, name: "example-nba-name" })
              ]}
            />
          </SiteContextProvider>
        </ThemeProvider>
      );
      expect(screen.getByTestId("tappable-card-body-title")).toHaveTextContent(
        "example-nba-name"
      );
    });

    it("should render the title prop as the NBA Card title, if the data type is ContentfulPageInfo", () => {
      render(
        <ThemeProvider>
          <SiteContextProvider value={getMockSiteContext()}>
            <NextBestActions
              data={[createPageInfoData({ title: "example-pageinfo-title" })]}
            />
          </SiteContextProvider>
        </ThemeProvider>
      );
      expect(screen.getByTestId("tappable-card-body-title")).toHaveTextContent(
        "example-pageinfo-title"
      );
    });
  });
});
