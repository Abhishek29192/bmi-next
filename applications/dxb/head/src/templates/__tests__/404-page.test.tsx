import { ThemeProvider } from "@bmi-digital/components";
import { LocationProvider } from "@reach/router";
import { render, screen } from "@testing-library/react";
import React from "react";
import FourOFour from "../../pages/404";
import { ContentfulSite } from "../../schema/resolvers/types/Contentful";
import createContentfulPromoCard from "../../schema/resolvers/types/helpers/ContentfulPromoCardHelper";
import { createMockSiteData } from "../../test/mockSiteData";
import { renderWithRouter } from "../../test/renderWithRouter";

describe("404 page tests", () => {
  describe("When site data and error page data are null", () => {
    it("renders place holder content", async () => {
      const { container } = render(
        <ThemeProvider>
          <FourOFour
            data={{ fourOFour: { siteData: null, errorPageData: null } }}
          />
        </ThemeProvider>
      );
      await screen.findByText(
        "It's not you, it's us - something went wrong on our web server."
      );
      expect(container).toMatchSnapshot();
      expect(async () => {
        screen.getByText(
          "It's not you, it's us - something went wrong on our web server."
        );
      }).not.toBeNull();
    });
  });
  describe("When site data and error page data are fully populated", () => {
    it("renders page content and FourOFour content", async () => {
      const errorData = createContentfulPromoCard();
      const { container } = renderWithRouter(
        <ThemeProvider>
          <LocationProvider>
            <FourOFour
              data={{
                fourOFour: {
                  siteData: createMockSiteData() as ContentfulSite,
                  errorPageData: errorData
                }
              }}
            />
          </LocationProvider>
        </ThemeProvider>
      );
      await screen.findByText(errorData.subtitle);
      expect(container).toMatchSnapshot();
      // title is rendered twice(page title and promo title)
      const titles = screen.getAllByText(errorData.title);
      expect(titles).toHaveLength(2);

      const subtitle = screen.getByText(errorData.subtitle);
      expect(subtitle).toBeInTheDocument();

      //verify CTA button is rendered
      const button = screen.getByText(errorData.cta.label);
      expect(button).toBeInTheDocument();

      //verify image is rendered
      const img = screen.getByAltText(errorData.featuredMedia.altText);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute(
        "src",
        errorData.featuredMedia.image.file.url
      );
    });
  });

  describe("When error page data is partially populated", () => {
    it("renders place holder content", async () => {
      const expectedSubTitle = "Error:404.subtitle";
      const expectedTitle = "Error:404.title";
      const expectedPlaceholderCTALabel = "Error:404.cta.label";
      const errorData = createContentfulPromoCard();
      errorData.title = null;
      errorData.subtitle = null;
      errorData.cta.label = null;
      const { container } = renderWithRouter(
        <ThemeProvider>
          <LocationProvider>
            <FourOFour
              data={{
                fourOFour: {
                  siteData: createMockSiteData() as ContentfulSite,
                  errorPageData: errorData
                }
              }}
            />
          </LocationProvider>
        </ThemeProvider>
      );
      await screen.findAllByText(expectedTitle);
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
      expect(img).toHaveAttribute(
        "src",
        errorData.featuredMedia.image.file.url
      );
    });
  });
});
