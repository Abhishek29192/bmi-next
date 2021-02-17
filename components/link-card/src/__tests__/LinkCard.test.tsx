import React from "react";
import { render } from "@testing-library/react";
import LinkCard from "../";

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
