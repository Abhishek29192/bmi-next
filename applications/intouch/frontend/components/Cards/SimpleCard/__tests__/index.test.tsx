import React from "react";
import { render } from "@testing-library/react";
import { SimpleCard } from "..";

describe("SimpleCard component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <SimpleCard>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita amet
          vel iste! Saepe iusto quod, dolor perspiciatis dolorem blanditiis
          quidem sit doloremque similique architecto repellat ipsa illum
          mollitia perferendis! Eius.
        </p>
      </SimpleCard>
    );
    expect(container).toMatchSnapshot();
  });
});
