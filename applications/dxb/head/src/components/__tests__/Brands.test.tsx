import { ThemeProvider } from "@bmi/components";
import { render } from "@testing-library/react";
import React from "react";
import Brands from "../Brands";

describe("Brands component", () => {
  const brandData = [
    {
      title: "Smilex",
      path: "/smilex",
      subtitle: "Uh-oh.  He don't look happy. He's been using brand X",
      brandLogo: "BMI"
    }
  ];
  it("renders correctly", () => {
    const brandData = [
      {
        title: "Smilex",
        path: "/smilex",
        subtitle: "Uh-oh.  He don't look happy. He's been using brand X",
        brandLogo: "BMI"
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
    const { getByRole } = render(
      <ThemeProvider>
        <Brands data={brandData} spaBrand />
      </ThemeProvider>
    );
    expect(
      getByRole("link", { name: "MC: homepage.brands.learn" }).getAttribute(
        "target"
      )
    ).toBe("_blank");
    expect(
      getByRole("link", { name: "MC: homepage.brands.learn" }).getAttribute(
        "rel"
      )
    ).toBe("noopener noreferrer");
  });

  it("renders brand correctyly without description", () => {
    const { container } = render(
      <ThemeProvider>
        <Brands data={[{ ...brandData[0], subtitle: undefined }]} />
      </ThemeProvider>
    );
    expect(container.querySelector(".description")).not.toBeInTheDocument();
  });

  it("renders brand correctly without brand path", () => {
    const { queryByRole, container } = render(
      <ThemeProvider>
        <Brands data={[{ ...brandData[0], path: undefined }]} />
      </ThemeProvider>
    );

    expect(
      queryByRole("link", { name: "MC: homepage.brands.learn" })
    ).not.toBeInTheDocument();

    expect(
      container.querySelector("[class*='brandLogoButton'][class*='noPointer']")
    ).toBeInTheDocument();
  });

  it("renders brand correctly without brand path and no description", () => {
    const { container } = render(
      <ThemeProvider>
        <Brands
          data={[{ ...brandData[0], path: undefined, subtitle: undefined }]}
        />
      </ThemeProvider>
    );

    expect(container.querySelector(".description")).not.toBeInTheDocument();
  });
});
