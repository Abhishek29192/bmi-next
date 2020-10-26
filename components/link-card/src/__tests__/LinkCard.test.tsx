import React from "react";
import LinkCard from "../";
import { render } from "@testing-library/react";

describe("LinkCard component", () => {
  it("renders correctly open variant", () => {
    const { container } = render(<LinkCard title="test">test</LinkCard>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders closed variant", () => {
    const { container } = render(
      <LinkCard isOpen title="test">
        test
      </LinkCard>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
