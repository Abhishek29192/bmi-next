import React from "react";
import { render } from "@testing-library/react";
import NBACard from "../";

describe("NbaCard component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <NBACard theme="blue-900" title="H4 Heading">
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          condimentum nisi at turpis fringilla, non malesuada mi porta. Aliquam
          ut eros in libero rutrum ullamcorper.
        </div>
      </NBACard>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders with footer", () => {
    const { container } = render(
      <NBACard theme="blue-900" title="H4 Heading" footer={<div>footer</div>}>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          condimentum nisi at turpis fringilla, non malesuada mi porta. Aliquam
          ut eros in libero rutrum ullamcorper.
        </div>
      </NBACard>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
