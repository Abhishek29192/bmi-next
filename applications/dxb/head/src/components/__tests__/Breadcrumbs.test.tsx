import { screen, within } from "@testing-library/react";
import React from "react";
import createBreadcrumbItem from "../../__tests__/helpers/BreadcrumbItemHelper";
import { renderWithProviders } from "../../__tests__/renderWithProviders";
import IntegratedBreadcrumbs, { Data } from "../Breadcrumbs";

const breadcrumbs: Data = [
  createBreadcrumbItem({ id: "1", label: "Monier", slug: "monier" }),
  createBreadcrumbItem({ id: "2", label: "Tiles", slug: "tiles" }),
  createBreadcrumbItem({ id: "3", label: "Red Tiles1", slug: "red-tiles1" }),
  createBreadcrumbItem({ id: "4", label: "Red Tiles2", slug: "red-tiles2" })
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

  it("should return the homepage and last breadcrumb item if there is only one item in the breadcrumb array", () => {
    const breadcrumbs: Data = [
      createBreadcrumbItem({ id: "1", label: "Monier", slug: "monier" })
    ];

    renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
      countryCode: "no",
      homePage: { title: "home-page" }
    });
    const breadcrumbsElement = screen.getByTestId("breadcrumbs");
    const homepageBreadcrumb = within(breadcrumbsElement).getByTestId(
      "bread-crumb-home-page"
    );

    expect(homepageBreadcrumb).toBeInTheDocument();
    expect(screen.getByTestId("bread-crumb-Monier")).toBeInTheDocument();
  });

  it("renders correctly when there are multiple breadcrumbs", () => {
    renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
      countryCode: "no",
      homePage: { title: "home-page" }
    });
    const breadcrumbsElement = screen.getByTestId("breadcrumbs");
    const breadCrumbRedTiles1 = within(breadcrumbsElement).getByTestId(
      "bread-crumb-Red-Tiles1"
    );

    expect(screen.getByTestId("bread-crumb-home-page")).toBeInTheDocument();
    expect(screen.getByTestId("bread-crumb-Monier")).toBeInTheDocument();
    expect(screen.getByTestId("bread-crumb-Tiles")).toBeInTheDocument();
    expect(breadCrumbRedTiles1).toBeInTheDocument();
    expect(screen.getByTestId("bread-crumb-Red-Tiles2")).toBeInTheDocument();
  });

  it("should set the global show more microCopy label to the ellipsis button", () => {
    const breadcrumbs: Data = [
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

      const breadcrumbsElement = screen.getByTestId("breadcrumbs");
      const breadCrumbRedTiles1 = within(breadcrumbsElement).getByTestId(
        "bread-crumb-Red-Tiles1"
      );

      expect(screen.getByTestId("bread-crumb-Monier")).toHaveAttribute(
        "href",
        "/no/monier"
      );
      expect(screen.getByTestId("bread-crumb-Tiles")).toHaveAttribute(
        "href",
        "/no/monier/tiles"
      );
      expect(breadCrumbRedTiles1).toHaveAttribute(
        "href",
        "/no/monier/tiles/red-tiles1"
      );
    });

    it("should filter out breadcrumb items if the slug is an empty string or null", () => {
      const breadcrumbs: Data = [
        createBreadcrumbItem({
          id: "1",
          label: "Monier Tiles",
          slug: ""
        }),
        createBreadcrumbItem({
          id: "2",
          label: "Green Tiles",
          slug: null
        }),
        createBreadcrumbItem({
          id: "3",
          label: "Red Tiles1",
          slug: "red-tiles1"
        })
      ];
      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home-page" }
      });

      const breadcrumbsElement = screen.getByTestId("breadcrumbs");
      const breadCrumbRedTiles1 = within(breadcrumbsElement).getByTestId(
        "bread-crumb-Red-Tiles1"
      );

      expect(breadCrumbRedTiles1).toBeInTheDocument();
      expect(
        screen.queryByTestId("bread-crumb-Monier-Tiles")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("bread-crumb-Green-Tiles")
      ).not.toBeInTheDocument();
    });

    it("should return the homepage breadcrumb and the last breadcrumb if all breadcrumb items have 'falsy' slugs", () => {
      const breadcrumbs: Data = [
        createBreadcrumbItem({
          id: "1",
          label: "Monier Tiles",
          slug: ""
        }),
        createBreadcrumbItem({
          id: "2",
          label: "Green Tiles",
          slug: null
        }),
        createBreadcrumbItem({
          id: "3",
          label: "Red Tiles1",
          slug: null
        })
      ];

      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home-page" }
      });

      const breadcrumbsElement = screen.getByTestId("breadcrumbs");
      const breadCrumbRedTiles1 = within(breadcrumbsElement).getByTestId(
        "bread-crumb-Red-Tiles1"
      );
      const homepageBreadcrumb = within(breadcrumbsElement).getByTestId(
        "bread-crumb-home-page"
      );

      expect(
        screen.queryByTestId("bread-crumb-Monier-Tiles")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("bread-crumb-Green-Tiles")
      ).not.toBeInTheDocument();
      expect(breadCrumbRedTiles1).toBeInTheDocument();
      expect(homepageBreadcrumb).toBeInTheDocument();
    });

    it("sets the label to the breadcrumb label", () => {
      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home-page" }
      });

      const breadcrumbsElement = screen.getByTestId("breadcrumbs");
      const breadCrumbRedTiles1 = within(breadcrumbsElement).getByTestId(
        "bread-crumb-Red-Tiles1"
      );

      expect(screen.getByTestId("bread-crumb-Monier")).toHaveTextContent(
        "Monier"
      );
      expect(screen.getByTestId("bread-crumb-Tiles")).toHaveTextContent(
        "Tiles"
      );

      expect(breadCrumbRedTiles1).toHaveTextContent("Red Tiles1");
    });

    it("should transform hyphens on the label", () => {
      const breadcrumbs: Data = [
        createBreadcrumbItem({
          id: "1",
          label: "Monier{-} Tiles",
          slug: "monier-tiles"
        }),
        createBreadcrumbItem({
          id: "2",
          label: "Green{-}Tiles",
          slug: "green-tiles"
        }),
        createBreadcrumbItem({
          id: "3",
          label: "Red{-}Tiles1",
          slug: "red-tiles1"
        }),
        createBreadcrumbItem({
          id: "4",
          label: "Red Tiles2",
          slug: "red-tiles2"
        })
      ];

      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home-page" }
      });

      const breadcrumbsElement = screen.getByTestId("breadcrumbs");
      const breadCrumbRedTiles1 = within(breadcrumbsElement).getByTestId(
        "bread-crumb-Red­Tiles1"
      );

      expect(screen.getByTestId("bread-crumb-Monier­-Tiles").textContent).toBe(
        "Monier\u00AD Tiles"
      );
      expect(screen.getByTestId("bread-crumb-Green­Tiles").textContent).toBe(
        "Green\u00ADTiles"
      );
      expect(breadCrumbRedTiles1).toHaveTextContent("Red\u00ADTiles1");
    });

    it("sets the gtm attribute correctly, removing hyphens in the label if present", () => {
      const breadcrumbs: Data = [
        createBreadcrumbItem({
          id: "1",
          label: "Monier{-} Tiles",
          slug: "monier-tiles"
        }),
        createBreadcrumbItem({
          id: "2",
          label: "Green{-}Tiles",
          slug: "green-tiles"
        }),
        createBreadcrumbItem({
          id: "3",
          label: "Red Tiles1",
          slug: "red-tiles1"
        }),
        createBreadcrumbItem({
          id: "4",
          label: "Red Tiles2",
          slug: "red-tiles2"
        })
      ];

      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home-page" }
      });

      const breadcrumbsElement = screen.getByTestId("breadcrumbs");
      const breadCrumbRedTiles1 = within(breadcrumbsElement).getByTestId(
        "bread-crumb-Red-Tiles1"
      );

      expect(screen.getByTestId("bread-crumb-Monier­-Tiles")).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"/no/monier-tiles","label":"Monier­ Tiles"}'
      );
      expect(screen.getByTestId("bread-crumb-Green­Tiles")).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"/no/monier-tiles/green-tiles","label":"Green­Tiles"}'
      );
      expect(breadCrumbRedTiles1).toHaveAttribute(
        "data-gtm",
        '{"id":"cta-click1","action":"/no/monier-tiles/green-tiles/red-tiles1","label":"Red Tiles1"}'
      );
    });
  });

  describe("Last breadcrumb item", () => {
    it("should use the last breadcrumb item in the array and not apply href or data-gtm attributes", () => {
      renderWithProviders(<IntegratedBreadcrumbs data={breadcrumbs} />, {
        countryCode: "no",
        homePage: { title: "home-page" }
      });
      expect(screen.getByTestId("bread-crumb-Red-Tiles2")).toBeInTheDocument();
      expect(screen.getByTestId("bread-crumb-Red-Tiles2")).not.toHaveAttribute(
        "href"
      );
      expect(screen.getByTestId("bread-crumb-Red-Tiles2")).not.toHaveAttribute(
        "data-gtm"
      );
    });

    it("should transform hyphens on the label", () => {
      const breadcrumbs: Data = [
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
      expect(breadCrumbTiles).toHaveAttribute("href", "/no/monier/tiles");
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
      expect(breadCrumbTiles).toHaveAttribute("href", "/no/monier/tiles");
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
      expect(breadCrumbTiles).toHaveAttribute("href", "/no/tiles");
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
        '{"id":"cta-click1","action":"/no/tiles","label":"Tiles"}'
      );
    });
  });
});
