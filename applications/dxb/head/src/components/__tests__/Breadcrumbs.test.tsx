import React from "react";
import { render } from "@testing-library/react";
import IntegratedBreadcrumbs from "../Breadcrumbs";
// import Breadcrumbs from "../components/breadcrumbs";

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

    const { container } = render(<IntegratedBreadcrumbs data={breadcrumbs} />);
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

    const { container } = render(<IntegratedBreadcrumbs data={breadcrumbs} />);
    expect(container).toMatchSnapshot();
  });
});
