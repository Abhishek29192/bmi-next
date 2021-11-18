import React from "react";
import { render } from "@testing-library/react";
import { local } from "../../utils/storage";
import SampleBasketSectionProducts from "../SampleBasketSectionProducts";
import {
  BasketContextProvider,
  createSample,
  Sample
} from "../../contexts/SampleBasketContext";
import { createVariantOption } from "../../__tests__/PimDocumentProductHelper";
import createImage from "../../__tests__/ImageHelper";
import createClassification, {
  createFeature
} from "../../__tests__/ClassificationHelper";
import { Product, VariantOption } from "../types/pim";

const getSiteContext = () => ({
  countryCode: "en",
  getMicroCopy: (microCopy: string) => `MC: ${microCopy}`,
  node_locale: "en-GB",
  homePage: {
    title: "Home page title"
  }
});

const product: Product = {
  code: "product",
  documents: null,
  isSampleOrderAllowed: null,
  longDescription: null,
  shortDescription: null,
  description: null,
  name: "sample",
  summary: null
};
const sample1: VariantOption = {
  code: "sample-1",
  path: null,
  breadcrumbs: null,
  approvalStatus: null,
  images: [createImage()],
  isSampleOrderAllowed: null,
  longDescription: null,
  shortDescription: null
};
const sample2 = { ...sample1, code: "sample-2" };
const sample3 = { ...sample1, code: "sample-3" };

const samples: Sample[] = [
  createSample(product, sample1),
  createSample(product, sample2),
  createSample(product, sample3)
];
jest.mock("@material-ui/core/useMediaQuery", () => () => true);
describe("SampleBasketSectionProducts component render correctly on mobile devices", () => {
  beforeAll(() => {
    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(samples));
  });

  it("renders correctly for mobile", () => {
    const { container } = render(
      <BasketContextProvider>
        <SampleBasketSectionProducts />
      </BasketContextProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
