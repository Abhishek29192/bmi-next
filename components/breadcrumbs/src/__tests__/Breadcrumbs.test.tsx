import React from "react";
import mediaQuery from "css-mediaquery";
import { render } from "@testing-library/react";
import Breadcrumbs from "..";

function createMatchMedia(width?: unknown) {
  return (query: string) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {}
  });
}

describe("Breadcrumbs component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Breadcrumbs>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
          BMI Group
        </Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/products" }}>
          Products
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Roof</Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/tiles" }}>
          Tiles
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Concrete Tiles</Breadcrumbs.Item>
      </Breadcrumbs>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly only one item", () => {
    const { container } = render(
      <Breadcrumbs>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
          BMI Group
        </Breadcrumbs.Item>
      </Breadcrumbs>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders dark themed correctly", () => {
    const { container } = render(
      <Breadcrumbs isDarkThemed>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
          BMI Group
        </Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/products" }}>
          Products
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Roof</Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/tiles" }}>
          Tiles
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Concrete Tiles</Breadcrumbs.Item>
      </Breadcrumbs>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders on a small breakpoint", () => {
    // @ts-ignore Only used for testing.
    window.matchMedia = createMatchMedia(600);

    const { container } = render(
      <Breadcrumbs isDarkThemed>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
          BMI Group
        </Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/products" }}>
          Products
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Roof</Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/tiles" }}>
          Tiles
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Concrete Tiles</Breadcrumbs.Item>
      </Breadcrumbs>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders on a large breakpoint", () => {
    // @ts-ignore Only used for testing.
    window.matchMedia = createMatchMedia(1280);

    const { container } = render(
      <Breadcrumbs isDarkThemed>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
          BMI Group
        </Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/products" }}>
          Products
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Roof</Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/tiles" }}>
          Tiles
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Concrete Tiles</Breadcrumbs.Item>
      </Breadcrumbs>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly more than 5 items - small screens", () => {
    // @ts-ignore Only used for testing.
    window.matchMedia = createMatchMedia(600);

    const { container } = render(
      <Breadcrumbs>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
          BMI Group
        </Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/products" }}>
          Products
        </Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/tiles" }}>
          Tiles
        </Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/tea" }}>
          Tea
        </Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/biscuits" }}>
          Biscuits
        </Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/chocolate" }}>
          Chocolate
        </Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/ice-cream" }}>
          Ice Cream
        </Breadcrumbs.Item>
        <Breadcrumbs.Item action={{ model: "htmlLink", href: "/pizza" }}>
          Pizza
        </Breadcrumbs.Item>
      </Breadcrumbs>
    );
    expect(container).toMatchSnapshot();
  });
});
