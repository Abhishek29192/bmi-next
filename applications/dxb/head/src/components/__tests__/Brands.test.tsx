import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render, screen } from "@testing-library/react";
import React from "react";
import Brands, { Data } from "../Brands";

describe("Brands component", () => {
  const brandData: Data[] = [
    {
      title: "Smilex",
      brandLogo: "Icopal",
      subtitle: "Uh-oh.  He don't look happy. He's been using brand X",
      path: "/smilex"
    }
  ];

  it("renders correctly", () => {
    const brandData: Data[] = [
      {
        title: "Smilex",
        path: "/smilex",
        subtitle: "Uh-oh.  He don't look happy. He's been using brand X",
        brandLogo: "Icopal"
      }
    ];

    const { container } = render(
      <ThemeProvider>
        <Brands data={brandData} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders brand actions correctly for spaBrand to be external links", () => {
    render(
      <ThemeProvider>
        <Brands data={brandData} spaBrand />
      </ThemeProvider>
    );
    expect(
      screen
        .getByRole("link", { name: "MC: homepage.brands.learn" })
        .getAttribute("target")
    ).toBe("_blank");
    expect(
      screen
        .getByRole("link", { name: "MC: homepage.brands.learn" })
        .getAttribute("rel")
    ).toBe("noopener noreferrer");
  });

  it("renders brand correctyly without description", () => {
    render(
      <ThemeProvider>
        <Brands data={[{ ...brandData[0], subtitle: undefined }]} />
      </ThemeProvider>
    );
    expect(
      screen.queryByTestId("brandLogoDescription")
    ).not.toBeInTheDocument();
  });

  it("renders brand correctly without brand path", () => {
    render(
      <ThemeProvider>
        <Brands data={[{ ...brandData[0], path: undefined }]} />
      </ThemeProvider>
    );

    expect(
      screen.queryByRole("link", { name: "MC: homepage.brands.learn" })
    ).not.toBeInTheDocument();

    expect(screen.getByTestId("brandLogoButton")).toHaveClass(
      "BrandIntroCard-noPointer"
    );
  });

  it("renders brand correctly without brand path and no description", () => {
    render(
      <ThemeProvider>
        <Brands
          data={[{ ...brandData[0], path: undefined, subtitle: undefined }]}
        />
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("brandLogoDescription")
    ).not.toBeInTheDocument();
  });
});
