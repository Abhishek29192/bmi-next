import React from "react";
import { render, cleanup } from "@testing-library/react";
import ProductLeadBlock from "../ProductLeadBlock";
import {
  mapGalleryImages,
  transformImages
} from "../../utils/product-details-transforms";
import createSystemDetails from "../../test/systemDetailsMockData";
import { Image } from "../types/pim";

const systemDetailsMockData = createSystemDetails();
describe("ProductLeadBlock tests", () => {
  beforeEach(() => {
    // resolve useDimensions (useState) hook in TechnicalSpecificationLeadBlock ProductFeatureTable
    jest.mock("react", () => ({
      ...(jest.requireActual("react") as any),
      useState: (initial) => [initial, jest.fn()]
    }));
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback: FrameRequestCallback): number => {
        callback(0);
        return 0;
      });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("should render the technical draws tab", () => {
    const techDrawings = transformImages(
      mapGalleryImages(systemDetailsMockData.images as Image[])
    );

    const { queryByTestId } = render(
      <ProductLeadBlock
        documents={[]}
        validClassifications={[]}
        classificationNamespace=""
        techDrawings={techDrawings}
      />
    );
    const productBlock = queryByTestId("technicalDrawings");
    expect(productBlock).toMatchSnapshot();
  });

  it("should not render the technical draws tab", () => {
    const { queryByTestId } = render(
      <ProductLeadBlock
        documents={[]}
        validClassifications={[]}
        classificationNamespace=""
        techDrawings={[]}
      />
    );
    const productBlock = queryByTestId("technicalDrawings");
    expect(productBlock).toBe(null);
  });
});
