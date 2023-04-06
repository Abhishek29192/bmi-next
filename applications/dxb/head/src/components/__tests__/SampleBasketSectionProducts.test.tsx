import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen } from "@testing-library/react";
import * as Gatsby from "gatsby";
import React from "react";
import {
  BasketContextProvider,
  Sample
} from "../../contexts/SampleBasketContext";
import { local } from "../../utils/storage";
import createPimImage from "../../__tests__/helpers/PimImageHelper";
import SampleBasketSectionProducts from "../SampleBasketSectionProducts";
import { SiteContextProvider } from "../Site";

const getSiteContext = () => ({
  countryCode: "en",
  getMicroCopy: (microCopy: string) => `MC: ${microCopy}`,
  node_locale: "en-GB",
  homePage: {
    title: "Home page title"
  }
});

const samples: Sample[] = [
  {
    name: "sample-1",
    code: "sample-1",
    path: "sample-1-details",
    colour: null,
    textureFamily: null,
    measurements: null,
    image: createPimImage().mainSource
  },
  {
    name: "sample-2",
    code: "sample-2",
    path: "sample-2-details",
    colour: "Red",
    textureFamily: "Matte",
    measurements: "10x20x30 mm",
    image: createPimImage().mainSource
  },
  {
    name: "sample-3",
    code: "sample-3",
    path: "sample-3-details",
    colour: "Black",
    textureFamily: null,
    measurements: null,
    image: createPimImage().mainSource
  }
];

describe("SampleBasketSectionProducts component", () => {
  beforeAll(() => {
    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(samples));
  });

  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should remove sample", () => {
    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );

    fireEvent.click(screen.queryAllByText("MC: pdp.overview.removeSample")[0]);

    expect(screen.queryByText("sample-1")).toBeNull();
  });

  it("should navigate to details", () => {
    jest.spyOn(Gatsby, "navigate").mockImplementation();

    render(
      <ThemeProvider>
        <SiteContextProvider value={getSiteContext()}>
          <BasketContextProvider>
            <SampleBasketSectionProducts />
          </BasketContextProvider>
        </SiteContextProvider>
      </ThemeProvider>
    );

    fireEvent.click(screen.queryByText("sample-1"));

    expect(Gatsby.navigate).toBeCalledWith("/en/sample-1-details/");
  });
});
