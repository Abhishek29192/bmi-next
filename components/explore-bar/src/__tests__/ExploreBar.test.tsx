import React from "react";
import { render } from "@testing-library/react";
import ExploreBar from "..";

describe("ExploreBar component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ExploreBar
        heading="Explore:"
        links={[
          { label: "hello", action: { model: "htmlLink", href: "world" } }
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with multiple links", () => {
    const { container } = render(
      <ExploreBar
        heading="Explore:"
        links={[
          { label: "Tools", action: { model: "htmlLink", href: "/tools" } },
          {
            label: "Engineering guides",
            action: { model: "htmlLink", href: "/engineering-guides" }
          },
          {
            label: "Training",
            action: { model: "htmlLink", href: "/training" }
          },
          {
            label: "Frequently asked questions",
            action: { model: "htmlLink", href: "/frequently-asked-questions" }
          }
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with different heading", () => {
    const { container } = render(
      <ExploreBar
        heading="Hello world"
        links={[
          { label: "Hello", action: { model: "htmlLink", href: "/world" } }
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with a link using a component", () => {
    const Link = React.forwardRef(({ children, ...props }: any, ref) => (
      <div {...props} ref={ref}>
        {children}
      </div>
    ));
    Link.displayName = "Link";

    const { container } = render(
      <ExploreBar
        heading="Hello world"
        links={[
          {
            label: "Hello",
            action: { model: "routerLink", to: "/world", linkComponent: Link }
          }
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
