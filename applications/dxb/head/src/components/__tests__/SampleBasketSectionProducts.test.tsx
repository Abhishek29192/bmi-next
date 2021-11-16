import React from "react";
import * as Gatsby from "gatsby";
import { fireEvent, render, screen } from "@testing-library/react";
import { local } from "../../utils/storage";
import SampleBasketSectionProducts from "../SampleBasketSectionProducts";
import {
  BasketContextProvider,
  Sample
} from "../../contexts/SampleBasketContext";
import createImage from "../../__tests__/ImageHelper";
import createClassification, {
  createFeature
} from "../../__tests__/ClassificationHelper";
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
    image: createImage().url,
    path: "sample-1-details",
    classifications: [createClassification({ code: "appearanceAttributes" })]
  },
  {
    name: "sample-2",
    code: "sample-2",
    path: "sample-2-details",
    image: createImage().url,
    classifications: [
      createClassification({
        code: "measurements",
        features: [
          createFeature({
            featureValues: [{ value: "10" }],
            featureUnit: { symbol: "mm", name: "mm", unitType: "size" }
          }),
          createFeature({ featureValues: [{ value: "20" }] })
        ]
      })
    ]
  },
  {
    name: "sample-3",
    code: "sample-3",
    path: "sample-3-details",
    image: createImage().url,
    classifications: []
  }
];

describe("SampleBasketSectionProducts component", () => {
  beforeAll(() => {
    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(samples));
  });

  it("renders correctly", () => {
    const { container } = render(
      <BasketContextProvider>
        <SampleBasketSectionProducts />
      </BasketContextProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should remove sample", () => {
    render(
      <BasketContextProvider>
        <SampleBasketSectionProducts />
      </BasketContextProvider>
    );

    fireEvent.click(screen.queryAllByText("MC: pdp.overview.removeSample")[0]);

    expect(screen.queryByText("sample-1")).toBeNull();
  });

  it("should navigate to details", () => {
    jest.spyOn(Gatsby, "navigate").mockImplementation();

    render(
      <SiteContextProvider value={getSiteContext()}>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </SiteContextProvider>
    );

    fireEvent.click(screen.queryByText("sample-1"));

    expect(Gatsby.navigate).toBeCalledWith("/en/sample-1-details");
  });

  it("renders correctly for mobile", () => {
    jest.mock("@material-ui/core", () => ({
      useMediaQuery: jest.fn().mockRejectedValue(true)
    }));

    const { container } = render(
      <BasketContextProvider>
        <SampleBasketSectionProducts />
      </BasketContextProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
