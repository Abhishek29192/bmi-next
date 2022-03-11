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
import { PIMDocumentData, PIMLinkDocumentData } from "../types/PIMDocumentBase";

const systemDetailsMockData = createSystemDetails();
const awardsAndCertificatesAssets: Asset[] = [
  {
    allowedToDownload: true,
    assetType: "WARRANTIES",
    fileSize: 8470,
    mime: "application/pdf",
    name: "Monier garanti 30 år",
    realFileName: "Monier garanti 30 år.pdf",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hbc/hd9/9009904058398/Monier-garanti-30-arpdf"
  }
];
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
const document: PIMDocumentData = {
  __typename: "PIMDocument",
  fileSize: 234,
  extension: "jpg",
  format: "image/jpg",
  id: "dummy-id",
  url: "https://doesnt-exist.com",
  title: "dummy-title",
  realFileName: null,
  product: {
    name: "dummy-product",
    code: "dummy-code"
  },
  assetType: {
    __typename: "ContentfulAssetType",
    id: "some-asset-id",
    name: "Technical Approvals",
    code: "TALS",
    description: null,
    pimCode: "TECHNICAL_APPROVALS"
  }
};
const linkdocument: PIMLinkDocumentData = {
  __typename: "PIMLinkDocument",
  id: "dummy-id",
  url: "https://doesnt-exist.com",
  title: "dummy-title",
  product: {
    name: "dummy-product",
    code: "dummy-code"
  },
  assetType: {
    __typename: "ContentfulAssetType",
    id: "some-asset-id",
    name: "Technical Approvals",
    code: "TALS",
    description: null,
    pimCode: "TECHNICAL_APPROVALS"
  }
};

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

  it("should render guarantees & warranties images & links on on about tab", () => {
    const { container } = render(
      <ProductLeadBlock
        documents={[]}
        validClassifications={[]}
        classificationNamespace=""
        techDrawings={[]}
        guaranteesAndWarranties={guaranteesAndWarrantiesAssets}
        awardsAndCertificates={awardsAndCertificatesAssets}
      />
    );
    expect(container).toMatchSnapshot();
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
  it("should render the fixing tool tab", () => {
    const fixingToolIframeUrl = "https://monier.service.bouwconnect.nl/";

    const { queryByTestId } = render(
      <ProductLeadBlock
        documents={[]}
        validClassifications={[]}
        classificationNamespace=""
        techDrawings={[]}
        fixingToolIframeUrl={fixingToolIframeUrl}
      />
    );
    const productBlock = queryByTestId("fixingTool");
    expect(productBlock).toMatchSnapshot();
  });
  it("should render the fixing tool tab with title and iframe", () => {
    const fixingToolIframeUrl = "https://monier.service.bouwconnect.nl/";

    const { queryByTestId } = render(
      <ProductLeadBlock
        documents={[]}
        validClassifications={[]}
        classificationNamespace=""
        techDrawings={[]}
        fixingToolIframeUrl={fixingToolIframeUrl}
        pdpFixingToolDescription={null}
        pdpFixingToolTitle="Fixing tool title"
      />
    );
    const productBlock = queryByTestId("fixingTool");
    expect(productBlock).toMatchSnapshot();
  });

  it("should not render the fixing tool tab", () => {
    const { queryByTestId } = render(
      <ProductLeadBlock
        documents={[]}
        validClassifications={[]}
        classificationNamespace=""
        techDrawings={[]}
        fixingToolIframeUrl={null}
        pdpFixingToolDescription={null}
        pdpFixingToolTitle={null}
      />
    );
    const productBlock = queryByTestId("fixingTool");
    expect(productBlock).toBe(null);
  });

  it("should render the specification tab", () => {
    const specificationIframeUrl = "https://monier.service.bouwconnect.nl/";
    const { queryByTestId } = render(
      <ProductLeadBlock
        documents={[]}
        validClassifications={[]}
        classificationNamespace=""
        techDrawings={[]}
        specificationIframeUrl={specificationIframeUrl}
        pdpSpecificationTitle="Specification title"
        pdpSpecificationDescription={null}
      />
    );
    const productBlock = queryByTestId("specification");
    expect(productBlock).toMatchSnapshot();
  });
  it("should render the documents and download tab", () => {
    const specificationIframeUrl = "https://monier.service.bouwconnect.nl/";
    const { queryByTestId } = render(
      <ProductLeadBlock
        documents={[document]}
        validClassifications={[]}
        classificationNamespace=""
        techDrawings={[]}
        specificationIframeUrl={specificationIframeUrl}
        pdpSpecificationTitle="Specification title"
        pdpSpecificationDescription={null}
      />
    );
    const productBlock = queryByTestId("specification");
    expect(productBlock).toMatchSnapshot();
  });
  it("should zip the pimDocuments if they are of same asset type", () => {
    const specificationIframeUrl = "https://monier.service.bouwconnect.nl/";
    const documents = [
      document,
      linkdocument,
      linkdocument,
      {
        ...linkdocument,
        assetType: { ...linkdocument.assetType, code: "code1" }
      },
      {
        ...linkdocument,
        assetType: { ...linkdocument.assetType, code: "code1" }
      },
      { ...document, filesize: 123 },
      { ...document, assetType: { ...document.assetType, code: "code1" } },
      { ...document, assetType: { ...document.assetType, code: "code1" } }
    ];
    const { container } = render(
      <ProductLeadBlock
        documents={documents}
        validClassifications={[]}
        classificationNamespace=""
        techDrawings={[]}
        specificationIframeUrl={specificationIframeUrl}
        pdpSpecificationTitle="Specification title"
        pdpSpecificationDescription={null}
      />
    );
    expect(container.getElementsByClassName("row").length).toBe(6);
    expect(container.getElementsByClassName("Checkbox").length).toBe(2);
    expect(container).toMatchSnapshot();
  });
});
