import { screen } from "@testing-library/react";
import React from "react";
import { renderWithProviders } from "../../__tests__/renderWithProviders";
import IntegratedBreadcrumbs from "../Breadcrumbs";

describe("Breadcrumbs component", () => {
  it("renders correctly", () => {
    const breadcrumbs = [
      {
        id: "test",
        label: "test",
        slug: "/test"
      },
      {
        id: "test2",
        label: "test2",
        slug: "/test2"
      }
    ];

    const { container } = renderWithProviders(
      <IntegratedBreadcrumbs data={breadcrumbs} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with test id", () => {
    const breadcrumbs = [
      {
        id: "test",
        label: "test",
        slug: "/test"
      },
      {
        id: "test2",
        label: "test2",
        slug: "/test2"
      }
    ];

    const { container } = renderWithProviders(
      <IntegratedBreadcrumbs data={breadcrumbs} data-testid="custom-test-id" />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly only one item", () => {
    const breadcrumbs = [
      {
        id: "test",
        label: "test",
        slug: "/test"
      }
    ];

    const { container } = renderWithProviders(
      <IntegratedBreadcrumbs data={breadcrumbs} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders breadcrumb items correctly if concatenateUrls prop is set to false", async () => {
    const breadcrumbs = [
      {
        id: "test-1",
        label: "test-1",
        slug: "test-1"
      },
      {
        id: "test-2",
        label: "test-2",
        slug: "test-2"
      },
      {
        id: "test-3",
        label: "test-3",
        slug: "test-3"
      }
    ];

    renderWithProviders(
      <IntegratedBreadcrumbs data={breadcrumbs} concatenateUrls={false} />,
      { countryCode: "no" }
    );
    expect(screen.getByTestId("bread-crumb-test-1")).toHaveAttribute(
      "href",
      "/no/test-1/"
    );
    expect(screen.getAllByTestId("bread-crumb-test-2")[0]).toHaveAttribute(
      "href",
      "/no/test-2/"
    );
  });

  it("renders breadcrumb items correctly if concatenateUrls prop is set to true", async () => {
    const breadcrumbs = [
      {
        id: "test-1",
        label: "test-1",
        slug: "test-1"
      },
      {
        id: "test-2",
        label: "test-2",
        slug: "test-2"
      },
      {
        id: "test-3",
        label: "test-3",
        slug: "test-3"
      }
    ];

    renderWithProviders(
      <IntegratedBreadcrumbs data={breadcrumbs} concatenateUrls={true} />,
      { countryCode: "no" }
    );
    expect(screen.getByTestId("bread-crumb-test-1")).toHaveAttribute(
      "href",
      "/no/test-1/"
    );
    expect(screen.getAllByTestId("bread-crumb-test-2")[0]).toHaveAttribute(
      "href",
      "/no/test-1/test-2/"
    );
  });

  it("renders breadcrumb items correctly if concatenateUrls prop is not defined", async () => {
    const breadcrumbs = [
      {
        id: "test-1",
        label: "test-1",
        slug: "test-1"
      },
      {
        id: "test-2",
        label: "test-2",
        slug: "test-2"
      },
      {
        id: "test-3",
        label: "test-3",
        slug: "test-3"
      }
    ];

    renderWithProviders(
      <IntegratedBreadcrumbs data={breadcrumbs} concatenateUrls={undefined} />,
      { countryCode: "no" }
    );
    expect(screen.getByTestId("bread-crumb-test-1")).toHaveAttribute(
      "href",
      "/no/test-1/"
    );
    expect(screen.getAllByTestId("bread-crumb-test-2")[0]).toHaveAttribute(
      "href",
      "/no/test-1/test-2/"
    );
  });
});
