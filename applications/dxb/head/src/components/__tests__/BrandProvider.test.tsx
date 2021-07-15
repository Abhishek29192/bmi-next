import "@testing-library/jest-dom";

import React from "react";
import { render } from "@testing-library/react";
import BrandProvider, {
  changePrimaryColor,
  getBrandClassName
} from "../BrandProvider";

describe("BrandProvider component", () => {
  it("renders correctly", () => {
    const { container } = render(<BrandProvider>hi</BrandProvider>);

    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with brand ", () => {
    const { container } = render(
      <BrandProvider brand="Braas">hi</BrandProvider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should not have have className without brand", () => {
    const { getByTestId } = render(<BrandProvider>Tests</BrandProvider>);

    expect(getByTestId("brand-colors-provider")).not.toHaveClass();
  });

  it("should not have have className from config if brand 'Braas'", () => {
    const brand = "Braas";
    const { getByTestId } = render(
      <BrandProvider brand={brand}>Tests</BrandProvider>
    );

    expect(getByTestId("brand-colors-provider")).toHaveClass(
      getBrandClassName(brand)
    );
  });

  it("should not have have className from config if brand 'Esha'", () => {
    const brand = "Esha";
    const { getByTestId } = render(
      <BrandProvider brand={brand}>Tests</BrandProvider>
    );

    expect(getByTestId("brand-colors-provider")).toHaveClass(
      getBrandClassName(brand)
    );
  });
});

describe("expandTheme function", () => {
  it("should return change theme primary color", () => {
    const theme = {
      palette: {
        primary: {
          main: "#ffffff"
        },
        secondary: {
          main: "#0044ff"
        }
      }
    };

    expect(changePrimaryColor("#000000")(theme)).toEqual({
      palette: {
        primary: {
          main: "#000000"
        },
        secondary: {
          main: "#0044ff"
        }
      }
    });
  });
});
