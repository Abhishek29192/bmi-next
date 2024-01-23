import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render } from "@testing-library/react";
import React from "react";
import Brands, { Data } from "../Brands";

describe("Brands component", () => {
  const brandData: Data[] = [
    {
      title: "Monier",
      brandLogo: "Monier",
      subtitle: "Some Monier brand description goes here",
      path: "/monier"
    },
    {
      title: "Icopal",
      brandLogo: "Icopal",
      subtitle: "Some Icopal brand description goes here",
      path: "/icopal"
    }
  ];

  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <Brands data={brandData} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
