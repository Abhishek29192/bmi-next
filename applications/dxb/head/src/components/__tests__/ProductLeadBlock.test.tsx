import { render } from "@testing-library/react";
import React from "react";
import { microCopy } from "../../constants/microCopies";
import createAssetType from "../../__tests__/helpers/AssetTypeHelper";
import createPimDocument from "../../__tests__/helpers/PimDocumentHelper";
import createProduct from "../../__tests__/helpers/ProductHelper";
import ProductLeadBlock from "../ProductLeadBlock";

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
  jest.clearAllMocks();
});
//product to test documents and download tab
const product = createProduct();
describe("ProductLeadBlock tests", () => {
  it("should render guarantees & warranties images & links on about tab", () => {
    const { getByTestId, container, queryByText } = render(
      <ProductLeadBlock product={product} />
    );

    const aboutTab = getByTestId("aboutTab");
    const title = queryByText(
      `MC: ${microCopy.PDP_LEAD_BLOCK_GUARANTEES_WARRANTIES}`
    );
    //expect guarantees & warranties block is rendered
    expect(title).not.toBeNull();
    //expect two images
    expect(
      container
        .getElementsByClassName("GuaranteesAndAwardsAsset")[0]
        .getElementsByClassName("image").length
    ).toBe(2);
    //expect two links
    expect(
      container
        .getElementsByClassName("GuaranteesAndAwardsAsset")[0]
        .getElementsByTagName("a").length
    ).toBe(2);

    expect(aboutTab).toMatchSnapshot();
  });

  it("shouldn't render guarantees & warranties block on about tab if guarantees & warranties images and links are empty array", async () => {
    const { queryByText } = render(
      <ProductLeadBlock
        product={createProduct({
          guaranteesAndWarrantiesImages: [],
          guaranteesAndWarrantiesLinks: []
        })}
      />
    );

    const title = queryByText(
      `MC: ${microCopy.PDP_LEAD_BLOCK_GUARANTEES_WARRANTIES}`
    );
    expect(title).toBeNull();
  });

  it("should render the technical draws tab", () => {
    const product = createProduct();

    const { queryByTestId } = render(<ProductLeadBlock product={product} />);

    const productBlock = queryByTestId("technicalDrawings");
    expect(productBlock).toMatchSnapshot();
  });

  it("should not render the technical draws tab", () => {
    const product = createProduct({ techDrawings: [] });

    const { queryByTestId } = render(<ProductLeadBlock product={product} />);

    const productBlock = queryByTestId("technicalDrawings");
    expect(productBlock).toBe(null);
  });

  it("should render the fixing tool tab", () => {
    const product = createProduct({
      fixingToolIframeUrl: "https://monier.service.bouwconnect.nl/"
    });

    const { queryByTestId } = render(<ProductLeadBlock product={product} />);

    const productBlock = queryByTestId("fixingTool");
    expect(productBlock).toMatchSnapshot();
  });

  it("should render the fixing tool tab with title and iframe", () => {
    const product = createProduct({
      fixingToolIframeUrl: "https://monier.service.bouwconnect.nl/"
    });

    const { queryByTestId } = render(
      <ProductLeadBlock
        product={product}
        pdpFixingToolDescription={null}
        pdpFixingToolTitle="Fixing tool title"
      />
    );

    const productBlock = queryByTestId("fixingTool");
    expect(productBlock).toMatchSnapshot();
  });

  it("should not render the fixing tool tab", () => {
    const product = createProduct({ fixingToolIframeUrl: null });

    const { queryByTestId } = render(
      <ProductLeadBlock
        product={product}
        pdpFixingToolDescription={null}
        pdpFixingToolTitle={null}
      />
    );

    const productBlock = queryByTestId("fixingTool");
    expect(productBlock).toBe(null);
  });

  it("should render the specification tab", () => {
    const product = createProduct({
      specificationIframeUrl: "https://monier.service.bouwconnect.nl/"
    });

    const { queryByTestId } = render(
      <ProductLeadBlock
        product={product}
        pdpSpecificationTitle="Specification title"
        pdpSpecificationDescription={null}
      />
    );

    const productBlock = queryByTestId("specification");
    expect(productBlock).toMatchSnapshot();
  });

  it("should render the documents and download tab", () => {
    const product = createProduct();

    const { queryByTestId } = render(<ProductLeadBlock product={product} />);
    const productBlock = queryByTestId("documentsTab");
    expect(productBlock).toMatchSnapshot();
  });

  it("should render documents tab with correct document count", () => {
    const { queryByTestId } = render(<ProductLeadBlock product={product} />);
    const productBlock = queryByTestId("documentsTab");
    expect(productBlock.getElementsByClassName("row").length).toBe(4);
    expect(productBlock).toMatchSnapshot();
  });
  it("renders correctly when document display format is by asset name", () => {
    const { container, queryByText, queryAllByText } = render(
      <ProductLeadBlock product={product} documentDisplayFormat="Asset name" />
    );
    expect(container.getElementsByClassName("row").length).toBe(4);
    expect(queryByText("MC: documentLibrary.headers.title")).toBeTruthy();
    expect(queryByText("MC: documentLibrary.headers.type")).toBeFalsy();
    expect(queryAllByText("Pim Document").length).toBe(4);
    expect(container).toMatchSnapshot();
  });
  it("renders correctly when document display format is by asset type", () => {
    const { container, queryByText } = render(
      <ProductLeadBlock
        product={createProduct({
          productDocuments: [
            createPimDocument({
              assetType: createAssetType({ name: "Assembley Instructions" })
            }),
            createPimDocument({
              assetType: createAssetType({ name: "Assembley Instructions" })
            })
          ]
        })}
        documentDisplayFormat="Asset type"
      />
    );

    expect(container).toMatchSnapshot();
    expect(queryByText("Pim Document")).toBeFalsy();
    expect(queryByText("MC: documentLibrary.headers.name")).toBeFalsy();
    expect(queryByText("MC: documentLibrary.headers.type")).toBeTruthy();
  });
  it("renders correctly when productDocuments is empy array", () => {
    const { container, queryByText } = render(
      <ProductLeadBlock
        product={createProduct({
          productDocuments: []
        })}
      />
    );

    expect(container).toMatchSnapshot();
    expect(queryByText("MC: pdp.leadBlock.documents")).toBeFalsy();
  });
});
