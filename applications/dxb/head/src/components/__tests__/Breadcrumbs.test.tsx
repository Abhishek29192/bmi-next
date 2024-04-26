import { screen, within } from "@testing-library/react";
import React from "react";
import createBreadcrumbItem from "../../__tests__/helpers/BreadcrumbItemHelper";
import { renderWithProviders } from "../../__tests__/renderWithProviders";
import IntegratedBreadcrumbs from "../Breadcrumbs";

const breadcrumbs = [
  createBreadcrumbItem({ id: "1", label: "Monier", slug: "monier" }),
  createBreadcrumbItem({ id: "2", label: "Tiles", slug: "tiles" }),
  createBreadcrumbItem({ id: "3", label: "Red Tiles", slug: "red-tiles" })
];

describe("Breadcrumbs component", () => {
  it("renders correctly with a custom test id", () => {
    renderWithProviders(
      <IntegratedBreadcrumbs data={breadcrumbs} data-testid="custom-test-id" />,
      {
        countryCode: "no",
        homePage: { title: "home-page" }
      }
    );
    expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
  });

  it("renders correctly when there are multiple breadcrumbs", () => {
    renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
      countryCode: "no",
      homePage: { title: "home-page" }
    });
    const breadcrumbsElement = screen.getByTestId("breadcrumbs");
    const breadCrumbTiles =
      within(breadcrumbsElement).getByTestId("bread-crumb-Tiles");
    expect(screen.getByTestId("bread-crumb-home-page")).toBeInTheDocument();
    expect(screen.getByTestId("bread-crumb-Monier")).toBeInTheDocument();
    expect(breadCrumbTiles).toBeInTheDocument();
    expect(screen.getByTestId("bread-crumb-Red-Tiles")).toBeInTheDocument();
  });

  it("should set the global show more microCopy label to the ellipsis button", () => {
    const breadcrumbs = [
      createBreadcrumbItem({ id: "1", label: "Monier", slug: "monier" }),
      createBreadcrumbItem({ id: "2", label: "Tiles", slug: "tiles" }),
      createBreadcrumbItem({ id: "3", label: "Red Tiles", slug: "red-tiles" }),
      createBreadcrumbItem({
        id: "4",
        label: "Green Tiles",
        slug: "green-tiles"
      }),
      createBreadcrumbItem({
        id: "5",
        label: "Blue Tiles",
        slug: "blue-tiles"
      }),
      createBreadcrumbItem({
        id: "6",
        label: "Yellow Tiles",
        slug: "yellow-tiles"
      })
    ];
    renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
      countryCode: "no",
      homePage: { title: "home-page" }
    });
    expect(screen.getByTestId("ellipsis-button")).toHaveAccessibleName(
      "MC: global.showMore"
    );
  });

  describe("First breadcrumb item", () => {
    it("sets the href attribute to the countrycode value", () => {
      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home-page" }
      });
      expect(screen.getByTestId("bread-crumb-home-page")).toHaveAttribute(
        "href",
        "/no/"
      );
    });

    it("sets the label to the home page title", () => {
      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home-page" }
      });
      expect(screen.getByTestId("bread-crumb-home-page")).toHaveTextContent(
        "home-page"
      );
    });

    it("should transform hyphens on the label", () => {
      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home{-}page" }
      });
      expect(screen.getByTestId("bread-crumb-home­page").textContent).toBe(
        "home\u00ADpage"
      );
    });

    it("sets the gtm attribute correctly, removing hyphens in the label if present", () => {
      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home{-} page" }
      });
      expect(screen.getByTestId("bread-crumb-home­-page")).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"/no/","label":"home­ page"}'
      );
    });
  });

  describe("Middle breadcrumbs items", () => {
    it("sets the href attribute to the countrycode with path", () => {
      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home-page" }
      });
      expect(screen.getByTestId("bread-crumb-Monier")).toHaveAttribute(
        "href",
        "/no/monier/tiles/"
      );
    });

    it("sets the label to the breadcrumb label", () => {
      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home-page" }
      });
      expect(screen.getByTestId("bread-crumb-Monier")).toHaveTextContent(
        "Monier"
      );
    });

    it("should transform hyphens on the label", () => {
      const breadcrumbs = [
        createBreadcrumbItem({
          id: "1",
          label: "Monier{-} Tiles",
          slug: "monier-tiles"
        }),
        createBreadcrumbItem({ id: "2", label: "Tiles", slug: "tiles" }),
        createBreadcrumbItem({ id: "3", label: "Red Tiles", slug: "red-tiles" })
      ];
      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home-page" }
      });
      expect(screen.getByTestId("bread-crumb-Monier­-Tiles").textContent).toBe(
        "Monier\u00AD Tiles"
      );
    });

    it("sets the gtm attribute correctly, removing hyphens in the label if present", () => {
      const breadcrumbs = [
        createBreadcrumbItem({
          id: "1",
          label: "Monier{-} Tiles",
          slug: "monier-tiles"
        }),
        createBreadcrumbItem({ id: "2", label: "Tiles", slug: "tiles" }),
        createBreadcrumbItem({ id: "3", label: "Red Tiles", slug: "red-tiles" })
      ];
      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home-page" }
      });
      expect(screen.getByTestId("bread-crumb-Monier­-Tiles")).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"/no/monier-tiles/","label":"Monier­ Tiles"}'
      );
    });
  });

  describe("Last breadcrumb item", () => {
    it("should be rendered", () => {
      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home-page" }
      });
      expect(screen.getByTestId("bread-crumb-Red-Tiles")).toBeInTheDocument();
    });

    it("should transform hyphens on the label", () => {
      const breadcrumbs = [
        createBreadcrumbItem({
          id: "1",
          label: "Monier{-} Tiles",
          slug: "monier-tiles"
        })
      ];
      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home-page" }
      });
      expect(screen.getByTestId("bread-crumb-Monier­-Tiles").textContent).toBe(
        "Monier\u00AD Tiles"
      );
    });
  });

  describe("ConcatenateUrls", () => {
    it("should concatenate the slugs into a string when concatenateUrls prop is true", () => {
      renderWithProviders(
        <IntegratedBreadcrumbs data={breadcrumbs} concatenateUrls={true} />,
        {
          countryCode: "no",
          homePage: { title: "home-page" }
        }
      );
      const breadcrumbsElement = screen.getByTestId("breadcrumbs");
      const breadCrumbTiles =
        within(breadcrumbsElement).getByTestId("bread-crumb-Tiles");
      expect(breadCrumbTiles).toHaveAttribute("href", "/no/monier/tiles/");
    });

    it("should concatenate the slugs into a string when concatenateUrls prop is undefined (default behaviour)", () => {
      renderWithProviders(
        <IntegratedBreadcrumbs
          data={breadcrumbs}
          concatenateUrls={undefined}
        />,
        {
          countryCode: "no",
          homePage: { title: "home-page" }
        }
      );
      const breadcrumbsElement = screen.getByTestId("breadcrumbs");
      const breadCrumbTiles =
        within(breadcrumbsElement).getByTestId("bread-crumb-Tiles");
      expect(breadCrumbTiles).toHaveAttribute("href", "/no/monier/tiles/");
    });

    it("should not concatenate the slugs into a string when concatenateUrls prop is false", () => {
      renderWithProviders(
        <IntegratedBreadcrumbs data={breadcrumbs} concatenateUrls={false} />,
        {
          countryCode: "no",
          homePage: { title: "home-page" }
        }
      );
      const breadcrumbsElement = screen.getByTestId("breadcrumbs");
      const breadCrumbTiles =
        within(breadcrumbsElement).getByTestId("bread-crumb-Tiles");
      expect(breadCrumbTiles).toHaveAttribute("href", "/no/tiles/");
    });

    it("should set the gtm attribute correctly when concatenateUrls is false", () => {
      renderWithProviders(
        <IntegratedBreadcrumbs data={breadcrumbs} concatenateUrls={false} />,
        {
          countryCode: "no",
          homePage: { title: "home-page" }
        }
      );
      const breadcrumbsElement = screen.getByTestId("breadcrumbs");
      const breadCrumbTiles =
        within(breadcrumbsElement).getByTestId("bread-crumb-Tiles");
      expect(breadCrumbTiles).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"/no/tiles/","label":"Tiles"}'
      );
    });
  });
});
