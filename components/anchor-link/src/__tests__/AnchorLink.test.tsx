import React from "react";
import AnchorLink from "..";
import { render } from "@testing-library/react";

describe("AnchorLink component", () => {
  it("renders default correctly", () => {
    const { container } = render(
      <AnchorLink action={{ model: "htmlLink", href: "/" }}>
        BMI Group
      </AnchorLink>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders disabled correctly", () => {
    const { container } = render(
      <AnchorLink action={{ model: "htmlLink", href: "/" }} isDisabled>
        BMI Group
      </AnchorLink>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders leading icon correctly", () => {
    const { container } = render(
      <AnchorLink action={{ model: "htmlLink", href: "/" }} iconStart>
        BMI Group
      </AnchorLink>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders trailing icon correctly", () => {
    const { container } = render(
      <AnchorLink action={{ model: "htmlLink", href: "/" }} iconEnd>
        BMI Group
      </AnchorLink>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders icon disabled correctly", () => {
    const { container } = render(
      <AnchorLink action={{ model: "htmlLink", href: "/" }} iconEnd isDisabled>
        BMI Group
      </AnchorLink>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders multi-line with icon correctly", () => {
    const { container } = render(
      <AnchorLink action={{ model: "htmlLink", href: "/" }} iconEnd>
        <p style={{ width: "300px", textAlign: "left" }}>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo.
        </p>
      </AnchorLink>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
