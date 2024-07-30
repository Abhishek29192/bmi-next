import ThemeProvider from "@bmi-digital/components/theme-provider";
import { LocationProvider } from "@reach/router";
import { render, screen } from "@testing-library/react";
import React from "react";
import FourOFour from "../../pages/404";
import { createMockSiteData } from "../../test/mockSiteData";
import { renderWithRouter } from "../../test/renderWithRouter";
import createPromoData from "../../__tests__/helpers/PromoHelper";
import type { Data as PromoData } from "../../components/Promo";

const errorData = createPromoData();

describe("404 page tests", () => {
  describe("When site data and error page data are null", () => {
    it("renders place holder content", () => {
      const { container } = render(
        <ThemeProvider>
          <FourOFour
            data={{ fourOFour: { siteData: null, errorPageData: null } }}
          />
        </ThemeProvider>
      );
      screen.getByText(
        "It's not you, it's us - something went wrong on our web server."
      );
      expect(container).toMatchSnapshot();
    });
  });
  describe("When site data and error page data are fully populated", () => {
    it("renders page content and FourOFour content", async () => {
      const { container } = renderWithRouter(
        <ThemeProvider>
          <LocationProvider>
            <FourOFour
              data={{
                fourOFour: {
                  siteData: createMockSiteData(),
                  errorPageData: errorData
                }
              }}
            />
          </LocationProvider>
        </ThemeProvider>
      );
      await screen.findByText(errorData.subtitle as string);
      expect(container).toMatchSnapshot();
      // title is rendered twice(page title and promo title)
      const titles = screen.getAllByText(errorData.title as string);
      expect(titles).toHaveLength(2);

      const subtitle = screen.getByText(errorData.subtitle as string);
      expect(subtitle).toBeInTheDocument();

      //verify CTA button is rendered
      const button = screen.getByText(errorData?.cta?.label as string);
      expect(button).toBeInTheDocument();

      //verify image is rendered
      const img = screen.getByAltText(errorData.featuredMedia.altText);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", errorData.featuredMedia.image.url);
    });
  });

  describe("When error page data is partially populated", () => {
    it("renders place holder content", () => {
      const expectedSubTitle = "Error:404.subtitle";
      const expectedTitle = "Error:404.title";
      const expectedPlaceholderCTALabel = "Error:404.cta.label";

      const errorPageData: PromoData = {
        ...errorData,
        title: undefined,
        subtitle: undefined,
        cta: {
          ...errorData.cta,
          label: null
        }
      };

      const { container } = renderWithRouter(
        <ThemeProvider>
          <LocationProvider>
            <FourOFour
              data={{
                fourOFour: {
                  siteData: createMockSiteData(),
                  errorPageData
                }
              }}
            />
          </LocationProvider>
        </ThemeProvider>
      );

      expect(container).toMatchSnapshot();
      // title is rendered twice(page title and promo title)
      const titles = screen.getAllByText(expectedTitle);
      expect(titles).toHaveLength(2);

      const subtitle = screen.getByText(expectedSubTitle);
      expect(subtitle).toBeInTheDocument();

      // verify CTA button is rendered
      const button = screen.getByText(expectedPlaceholderCTALabel);
      expect(button).toBeInTheDocument();

      // verify image is rendered
      const img = screen.getByAltText(errorData.featuredMedia.altText);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", errorData.featuredMedia.image.url);
    });
  });
});
