import { replaceSpaces, ThemeProvider } from "@bmi-digital/components";
import { render, screen } from "@testing-library/react";
import React from "react";
import {
  createImageAsset,
  createLinkAsset
} from "../../__tests__/helpers/AssetHelper";
import createAssetType from "../../__tests__/helpers/AssetTypeHelper";
import createPimDocument from "../../__tests__/helpers/PimDocumentHelper";
import createProduct from "../../__tests__/helpers/ProductHelper";
import { microCopy } from "../../constants/microCopies";
import ProductLeadBlock from "../ProductLeadBlock";

beforeEach(() => {
  // resolve useDimensions (useState) hook in TechnicalSpecificationLeadBlock ProductFeatureTable
  jest.mock("react", () => ({
    ...(jest.requireActual("react") as any),
    useState: (initial: unknown) => [initial, jest.fn()]
  }));
  jest
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation((callback: FrameRequestCallback): number => {
      callback(0);
      return 0;
    });
});

afterEach(() => {
  jest.clearAllMocks();
});
//product to test documents and download tab
const product = createProduct({
  guaranteesAndWarrantiesImages: [
    createImageAsset({ name: "asset-1", assetType: "GUARANTIES" }),
    createImageAsset({
      name: "asset-2",
      assetType: "WARRANTIES"
    })
  ],
  guaranteesAndWarrantiesLinks: [
    createLinkAsset({ name: "link-1", assetType: "GUARANTIES" }),
    createLinkAsset({ name: "link-2", assetType: "WARRANTIES" })
  ]
});
describe("ProductLeadBlock tests", () => {
  it("should render guarantees & warranties images & links on about tab", () => {
    render(
      <ThemeProvider>
        <ProductLeadBlock product={product} />
      </ThemeProvider>
    );

    const aboutTab = screen.getByTestId("aboutTab");
    const title = screen.queryByText(
      `MC: ${microCopy.PDP_LEAD_BLOCK_GUARANTEES_WARRANTIES}`
    );
    expect(title).not.toBeNull();
    product.guaranteesAndWarrantiesImages.forEach((image) => {
      expect(
        screen.getByTestId(`guarantee-image-${replaceSpaces(image.name)}`)
      ).toBeInTheDocument();
    });
    product.guaranteesAndWarrantiesLinks.forEach((link) => {
      expect(
        screen.getByTestId(`guarantee-inline-link-${replaceSpaces(link.name)}`)
      ).toBeInTheDocument();
    });
    expect(aboutTab).toMatchSnapshot();
  });

  it("shouldn't render guarantees & warranties block on about tab if guarantees & warranties images and links are empty array", async () => {
    render(
      <ThemeProvider>
        <ProductLeadBlock
          product={createProduct({
            guaranteesAndWarrantiesImages: [],
            guaranteesAndWarrantiesLinks: []
          })}
        />
      </ThemeProvider>
    );

    const title = screen.queryByText(
      `MC: ${microCopy.PDP_LEAD_BLOCK_GUARANTEES_WARRANTIES}`
    );
    expect(title).toBeNull();
  });

  it("should render the technical draws tab", () => {
    const product = createProduct();

    render(
      <ThemeProvider>
        <ProductLeadBlock product={product} />
      </ThemeProvider>
    );

    const productBlock = screen.queryByTestId("technicalDrawings");
    expect(productBlock).toMatchSnapshot();
  });

  it("should not render the technical draws tab", () => {
    const product = createProduct({ techDrawings: [] });

    render(
      <ThemeProvider>
        <ProductLeadBlock product={product} />
      </ThemeProvider>
    );

    const productBlock = screen.queryByTestId("technicalDrawings");
    expect(productBlock).toBe(null);
  });

  it("should render the fixing tool tab", () => {
    const product = createProduct({
      fixingToolIframeUrl: "https://monier.service.bouwconnect.nl/"
    });

    render(
      <ThemeProvider>
        <ProductLeadBlock product={product} />
      </ThemeProvider>
    );

    const productBlock = screen.queryByTestId("fixingTool");
    expect(productBlock).toMatchSnapshot();
  });

  it("should render the fixing tool tab with title and iframe", () => {
    const product = createProduct({
      fixingToolIframeUrl: "https://monier.service.bouwconnect.nl/"
    });

    render(
      <ThemeProvider>
        <ProductLeadBlock
          product={product}
          pdpFixingToolDescription={null}
          pdpFixingToolTitle="Fixing tool title"
        />
      </ThemeProvider>
    );

    const productBlock = screen.queryByTestId("fixingTool");
    expect(productBlock).toMatchSnapshot();
  });

  it("should not render the fixing tool tab", () => {
    const product = createProduct({ fixingToolIframeUrl: null });

    render(
      <ThemeProvider>
        <ProductLeadBlock
          product={product}
          pdpFixingToolDescription={null}
          pdpFixingToolTitle={null}
        />
      </ThemeProvider>
    );

    const productBlock = screen.queryByTestId("fixingTool");
    expect(productBlock).toBe(null);
  });

  it("should render the specification tab", () => {
    const product = createProduct({
      specificationIframeUrl: "https://monier.service.bouwconnect.nl/"
    });

    render(
      <ThemeProvider>
        <ProductLeadBlock
          product={product}
          pdpSpecificationTitle="Specification title"
          pdpSpecificationDescription={null}
        />
      </ThemeProvider>
    );

    const productBlock = screen.queryByTestId("specification");
    expect(productBlock).toMatchSnapshot();
  });

  it("should render the documents and download tab", () => {
    const product = createProduct();

    render(
      <ThemeProvider>
        <ProductLeadBlock product={product} />
      </ThemeProvider>
    );
    const productBlock = screen.queryByTestId("documentsTab");
    expect(productBlock).toMatchSnapshot();
  });

  it("should render documents tab with correct document count", () => {
    render(
      <ThemeProvider>
        <ProductLeadBlock product={product} />
      </ThemeProvider>
    );
    const productBlock = screen.queryByTestId("documentsTab");
    product.documents.forEach((document) => {
      expect(
        screen.getAllByTestId(`document-table-row-${document.id}`)
      ).toBeInTheDocument();
    });
    expect(productBlock).toMatchSnapshot();
  });
  it("renders correctly when document display format is by asset name", () => {
    const { container } = render(
      <ThemeProvider>
        <ProductLeadBlock
          product={product}
          documentDisplayFormat="Asset name"
        />
      </ThemeProvider>
    );
    expect(
      screen.getByText("MC: documentLibrary.headers.title")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("MC: documentLibrary.headers.type")
    ).not.toBeInTheDocument();
    expect(screen.queryAllByText("Pim Document").length).toBe(4);
    expect(container).toMatchSnapshot();
  });
  it("renders correctly when document display format is by asset type", () => {
    const { container } = render(
      <ThemeProvider>
        <ProductLeadBlock
          product={createProduct({
            productDocuments: [
              createPimDocument({
                assetType: createAssetType({ name: "Assembly Instructions" })
              }),
              createPimDocument({
                assetType: createAssetType({ name: "Assembly Instructions" })
              })
            ]
          })}
          documentDisplayFormat="Asset type"
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.queryByText("Pim Document")).not.toBeInTheDocument();
    expect(
      screen.queryByText("MC: documentLibrary.headers.name")
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("MC: documentLibrary.headers.type")
    ).toBeInTheDocument();
  });
  it("renders correctly when productDocuments is empty array", () => {
    const { container } = render(
      <ThemeProvider>
        <ProductLeadBlock
          product={createProduct({
            productDocuments: []
          })}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(
      screen.queryByText("MC: pdp.leadBlock.documents")
    ).not.toBeInTheDocument();
  });
});
