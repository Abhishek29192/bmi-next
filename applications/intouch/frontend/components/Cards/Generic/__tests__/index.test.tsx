import React from "react";
import { render } from "@testing-library/react";
import { GenericCard } from "..";

describe("GenericCard component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <GenericCard title="Generic Card Title">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita amet
          vel iste! Saepe iusto quod, dolor perspiciatis dolorem blanditiis
          quidem sit doloremque similique architecto repellat ipsa illum
          mollitia perferendis! Eius.
        </p>
      </GenericCard>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
