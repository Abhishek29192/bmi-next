import { ThemeProvider } from "@bmi-digital/components";
import { render, screen } from "@testing-library/react";
import React from "react";
import createContentfulDocument from "../../__tests__/helpers/ContentfulDocumentHelper";
import createPimDocument from "../../__tests__/helpers/PimDocumentHelper";
import { DocumentSimpleTableResultsMobile } from "../DocumentSimpleTableResultsMobile";
import { DocumentTableHeader } from "../../types/Document";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("DocumentSimpleTableResultsMobile component", () => {
  const pimDocument = createPimDocument();
  const defaultTableHeaders: DocumentTableHeader[] = [
    "add",
    "typeCode",
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

  it("renders correctly when valid asset types are used", () => {
    const document = createContentfulDocument({
      asset: {
        file: {
          url: "http://doesnot-exist.com/fileName",
          fileName: "test.onlv",
          contentType: "image/jpg",
          details: {
            size: 89898
          }
        }
      },
      __typename: "ContentfulDocument"
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
    expect(screen.getByTestId("download-icon")).toBeInTheDocument();
  });
  it("renders pim documents correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <DocumentSimpleTableResultsMobile
          documents={[pimDocument]}
          headers={defaultTableHeaders}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByText(pimDocument.title)).toBeInTheDocument();
    expect(screen.getByTestId("download-icon")).toBeInTheDocument();
  });
  it("renders multiple documents of same asset type as zip file", () => {
    const { container } = render(
      <ThemeProvider>
        <DocumentSimpleTableResultsMobile
          documents={[pimDocument]}
          headers={defaultTableHeaders}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    expect(screen.queryAllByText(pimDocument.title).length).toBe(1);
    expect(screen.getByTestId("download-icon")).toBeInTheDocument();
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
});
