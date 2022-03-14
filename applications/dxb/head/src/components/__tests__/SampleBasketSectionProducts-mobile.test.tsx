import { ThemeProvider } from "@bmi/components";
import { render } from "@testing-library/react";
import React from "react";
import {
  BasketContextProvider,
  Sample
} from "../../contexts/SampleBasketContext";
import { local } from "../../utils/storage";
import createImage from "../../__tests__/helpers/ImageHelper";
import SampleBasketSectionProducts from "../SampleBasketSectionProducts";

const samples: Sample[] = [
  {
    name: "sample-1",
    code: "sample-1",
    path: "sample-1-details",
    colour: null,
    textureFamily: null,
    measurements: null,
    image: createImage().mainSource
  },
  {
    name: "sample-2",
    code: "sample-2",
    path: "sample-2-details",
    colour: "Red",
    textureFamily: "Matte",
    measurements: "10x20x30 mm",
    image: createImage().mainSource
  },
  {
    name: "sample-3",
    code: "sample-3",
    path: "sample-3-details",
    colour: "Black",
    textureFamily: null,
    measurements: null,
    image: createImage().mainSource
  }
];
jest.mock("@material-ui/core/useMediaQuery", () => () => true);
describe("SampleBasketSectionProducts component render correctly on mobile devices", () => {
  beforeAll(() => {
    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(samples));
  });

  it("renders correctly for mobile", () => {
    const { container } = render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
