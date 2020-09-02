import React from "react";
import ExploreLinks from "../";
import { render } from "@testing-library/react";

describe("ExploreLinks component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ExploreLinks
        heading="Explore:"
        links={[{ label: "hello", href: "world" }]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with multiple links", () => {
    const { container } = render(
      <ExploreLinks
        heading="Explore:"
        links={[
          { label: "Tools", href: "/tools" },
          { label: "Engineering guides", href: "/engineering-guides" },
          { label: "Training", href: "/training" },
          {
            label: "Frequently asked questions",
            href: "/frequently-asked-questions"
          }
        ]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with different heading", () => {
    const { container } = render(
      <ExploreLinks
        heading="Hello world"
        links={[{ label: "Hello", href: "/world" }]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with a link using a component", () => {
    const Link = React.forwardRef(({ children, ...props }: any, ref) => (
      <div {...props} ref={ref}>
        {children}
      </div>
    ));
    Link.displayName = "Link";

    const { container } = render(
      <ExploreLinks
        heading="Hello world"
        links={[{ label: "Hello", to: "/world", component: Link }]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
