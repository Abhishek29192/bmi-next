import { ThemeProvider } from "@bmi-digital/components";
import { render } from "@testing-library/react";
import React from "react";
import IntegratedBreadcrumbs from "../Breadcrumbs"; // import Breadcrumbs from "../components/breadcrumbs";

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

    const { container } = render(
      <ThemeProvider>
        <IntegratedBreadcrumbs data={breadcrumbs} />
      </ThemeProvider>
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

    const { container } = render(
      <ThemeProvider>
        <IntegratedBreadcrumbs data={breadcrumbs} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
