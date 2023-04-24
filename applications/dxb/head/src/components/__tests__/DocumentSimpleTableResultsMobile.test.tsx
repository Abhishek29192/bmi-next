import { ThemeProvider } from "@bmi-digital/components";
import { render, screen } from "@testing-library/react";
import React from "react";
import createAssetType from "../../__tests__/helpers/AssetTypeHelper";
import createContentfulDocument from "../../__tests__/helpers/ContentfulDocumentHelper";
import createPimDocument, {
  createPseudoZipDocument
} from "../../__tests__/helpers/PimDocumentHelper";
import { DocumentTableHeader } from "../../types/Document";
import { DocumentSimpleTableResultsMobile } from "../DocumentSimpleTableResultsMobile";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("DocumentSimpleTableResultsMobile component", () => {
  const defaultTableHeaders: DocumentTableHeader[] = [
    "add",
    "title",
    "size",
    "actions"
  ];

  it("renders correctly", () => {
    const document = createContentfulDocument({
      asset: {
        file: {
          url: "http://doesnot-exist.com/fileName",
          fileName: "test.pdf",
          contentType: "application/pdf",
          details: {
            size: 89898
          }
        }
      }
    });

    const { container } = render(
      <ThemeProvider>
        <DocumentSimpleTableResultsMobile
          documents={[document]}
          headers={defaultTableHeaders}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders correctly when invalid asset types are used", () => {
    const document = createContentfulDocument({
      asset: {
        file: {
          url: "http://doesnot-exist.com/fileName",
          fileName: "test.onlv",
          contentType: "invalidType",
          details: {
            size: 89898
          }
        }
      },
      __typename: "ContentfulDocument"
    });

    try {
      render(
        <ThemeProvider>
          <DocumentSimpleTableResultsMobile
            documents={[document]}
            headers={defaultTableHeaders}
          />
        </ThemeProvider>
      );
    } catch (iconError) {
      expect(iconError).not.toBe(null);
    }
  });

  it("renders with productStatus field", () => {
    const document = createPimDocument();
    render(
      <ThemeProvider>
        <DocumentSimpleTableResultsMobile
          documents={[document]}
          headers={[...defaultTableHeaders, "productStatus"]}
        />
      </ThemeProvider>
    );
    expect(
      screen.getByText(/^MC: documentLibrary.headers.productStatus/)
    ).toBeInTheDocument();
  });

  it("renders correctly if productStatus field is not undefined", () => {
    const document = createPimDocument();
    render(
      <ThemeProvider>
        <DocumentSimpleTableResultsMobile
          documents={[{ ...document, approvalStatus: "approved" }]}
          headers={[...defaultTableHeaders, "productStatus"]}
        />
      </ThemeProvider>
    );
    expect(
      screen.getByText("MC: document.status.available")
    ).toBeInTheDocument();
  });

  it("renders with validityDate field", () => {
    const document = createPimDocument();
    render(
      <ThemeProvider>
        <DocumentSimpleTableResultsMobile
          documents={[document]}
          headers={[...defaultTableHeaders, "validityDate"]}
        />
      </ThemeProvider>
    );
    expect(
      screen.getByText(/^MC: documentLibrary.headers.validityDate/)
    ).toBeInTheDocument();
  });

  it("renders with typeCode field", () => {
    const document = createPimDocument({
      assetType: createAssetType({ code: "AINS" })
    });
    render(
      <ThemeProvider>
        <DocumentSimpleTableResultsMobile
          documents={[document]}
          headers={[...defaultTableHeaders, "typeCode"]}
        />
      </ThemeProvider>
    );
    expect(
      screen.getByText(/^MC: documentLibrary.headers.typeCode/)
    ).toBeInTheDocument();
  });

  it("renders with type field", () => {
    const document = createPimDocument({
      assetType: createAssetType({ name: "Assembly Instruction" })
    });
    render(
      <ThemeProvider>
        <DocumentSimpleTableResultsMobile
          documents={[document]}
          headers={[...defaultTableHeaders, "type"]}
        />
      </ThemeProvider>
    );
    expect(
      screen.getByText(/^MC: documentLibrary.headers.type/)
    ).toBeInTheDocument();
  });

  it("renders correctly if isLinkDocument === true", () => {
    const document = createPimDocument({ isLinkDocument: true });
    render(
      <ThemeProvider>
        <DocumentSimpleTableResultsMobile
          documents={[document]}
          headers={defaultTableHeaders}
        />
      </ThemeProvider>
    );

    expect(
      screen.queryByLabelText(`Download ${document.title}`)
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId(`document-table-size-${document.id}`)
    ).toHaveTextContent("-");
  });

  it("should not render 'Copy URL' button if document is PIMDocumentWithPseudoZip", () => {
    const zipDocument = createPseudoZipDocument();
    render(
      <ThemeProvider>
        <DocumentSimpleTableResultsMobile
          documents={[zipDocument]}
          headers={defaultTableHeaders}
        />
      </ThemeProvider>
    );
    expect(
      screen.queryByLabelText(`Copy ${zipDocument.title}`)
    ).not.toBeInTheDocument();
  });
});
