import React from "react";
import { render, cleanup } from "@testing-library/react";
import ProductLeadBlock from "../ProductLeadBlock";
import {
  mapGalleryImages,
  transformImages
} from "../../utils/product-details-transforms";
import createSystemDetails from "../../test/systemDetailsMockData";
import { Image } from "../types/pim";
import { Asset } from "../types/pim";

const systemDetailsMockData = createSystemDetails();
const guaranteesAndWarrantiesAssets: Asset[] = [
  {
    allowedToDownload: true,
    assetType: "WARRANTIES",
    fileSize: 8470,
    mime: "image/jpeg",
    name: "Monier garanti 30 år",
    realFileName: "Monier garanti 30 år.jpg",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hbc/hd9/9009904058398/Monier-garanti-30-arjpg"
  },
  {
    allowedToDownload: true,
    assetType: "GUARANTIES",
    fileSize: 12750,
    mime: "image/png",
    name: "Test_Guarantee",
    realFileName: "Test_Guarantee.png",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h6c/hba/9021243785246/Test-Guaranteepng"
  },
  {
    assetType: "GUARANTIES",
    name: "Read more about guarantees",
    url: "http://localhost:8000/other"
  },
  {
    assetType: "WARRANTIES",
    name: "Read more about Warranties",
    url: "http://bmigroup.com"
  },
  {
    assetType: "GUARANTIES",
    name: "external",
    url: "http://facebook.com"
  }
];
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
  it("should render guarantees & warranties images & links on on about tab", () => {
    const { container } = render(
      <ProductLeadBlock
        documents={[]}
        validClassifications={[]}
        classificationNamespace=""
        techDrawings={[]}
        guaranteesAndWarranties={guaranteesAndWarrantiesAssets}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
