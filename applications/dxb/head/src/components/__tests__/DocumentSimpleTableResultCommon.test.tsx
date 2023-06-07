import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import createAssetType from "../../__tests__/helpers/AssetTypeHelper";
import createPimDocument, {
  createPseudoZipDocument
} from "../../__tests__/helpers/PimDocumentHelper";
import { getDownloadLink } from "../../utils/client-download";
import { downloadMultipleFiles } from "../../utils/documentUtils";
import {
  CopyToClipboard,
  DocumentTitle,
  DownloadDocumentButton
} from "../DocumentSimpleTableResultCommon";

jest.mock("../../utils/documentUtils", () => {
  const origin = jest.requireActual("../../utils/documentUtils");
  return {
    ...origin,
    downloadMultipleFiles: jest.fn()
  };
});

jest.mock("../../utils/client-download", () => {
  const origin = jest.requireActual("../../utils/client-download");
  return {
    ...origin,
    getDownloadLink: jest.fn()
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("DocumentTitle component", () => {
  it("renders correctly if document is linkDocument", () => {
    const linkDocument = createPimDocument({ isLinkDocument: true });
    render(
      <ThemeProvider>
        <DocumentTitle document={linkDocument} />
      </ThemeProvider>
    );
    expect(
      screen.getByTestId("document-table-external-link-button")
    ).toBeInTheDocument();
  });

  it("renders correctly if document is PIMDocumentWithPseudoZip", () => {
    const zipDocument = createPseudoZipDocument();
    render(
      <ThemeProvider>
        <DocumentTitle document={zipDocument} />
      </ThemeProvider>
    );
    expect(
      screen.getByTestId("document-table-download-zip-button")
    ).toBeInTheDocument();
  });

  it("renders correctly if document is not PIMDocumentWithPseudoZip or linkDocument", () => {
    const document = createPimDocument({
      isLinkDocument: false,
      format: "application/pdf"
    });
    render(
      <ThemeProvider>
        <DocumentTitle document={document} />
      </ThemeProvider>
    );
    expect(
      screen.getByTestId(`document-table-download-${document.format}-button`)
    ).toBeInTheDocument();
  });

  it("calls downloadMultipleFiles function if user clicks on the PIMDocumentWithPseudoZip document title", () => {
    const zipDocument = createPseudoZipDocument({
      title: "PIMDocumentWithPseudoZip"
    });
    render(
      <ThemeProvider>
        <DocumentTitle document={zipDocument} />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByText(zipDocument.title));
    expect(downloadMultipleFiles).toHaveBeenCalled();
  });

  it("calls getDownloadLink function when user clicks on the title of PIMDocument", () => {
    const pimDocument = createPimDocument({
      title: "PIMDocument"
    });
    render(
      <ThemeProvider>
        <DocumentTitle document={pimDocument} />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByText(pimDocument.title));
    expect(getDownloadLink).toHaveBeenCalled();
  });

  it("renders assetType field as a title", () => {
    const document = createPimDocument({
      title: "Fake title",
      assetType: createAssetType({ name: "Assembly instructions" })
    });

    render(
      <ThemeProvider>
        <DocumentTitle document={document} titleField="type" />
      </ThemeProvider>
    );
    expect(screen.getByText("Assembly instructions")).toBeInTheDocument();
  });
});

describe("CopyToClipboard component", () => {
  it("renders 'Link Copied' message if user copies document url", async () => {
    const writeText = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText
      }
    });
    const document = createPimDocument();
    render(
      <ThemeProvider>
        <CopyToClipboard
          id={document.id}
          url={document.url}
          title={document.title}
        />
      </ThemeProvider>
    );
    const copyLinkButton = screen.getByLabelText(`Copy ${document.title}`);
    fireEvent.click(copyLinkButton);
    expect(writeText).toHaveBeenCalled();
    const message = await screen.findByLabelText(
      "MC: document.library.linkCopied.tooltip.title"
    );
    expect(message).toBeInTheDocument();
  });
});

describe("DownloadDocumentButton component", () => {
  it("calls getDownloadLink function when user downloads PIMDocuments", () => {
    const pimDocument = createPimDocument({
      title: "PIMDocument"
    });
    render(
      <ThemeProvider>
        <DownloadDocumentButton document={pimDocument} />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByLabelText(`Download ${pimDocument.title}`));
    expect(getDownloadLink).toHaveBeenCalled();
  });

  it("calls downloadMultipleFiles function when user downloads PIMDocumentWithPseudoZip", () => {
    const zipDocument = createPseudoZipDocument({
      title: "PIMDocumentWithPseudoZip"
    });
    render(
      <ThemeProvider>
        <DownloadDocumentButton document={zipDocument} />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByLabelText(`Download ${zipDocument.title}`));
    expect(downloadMultipleFiles).toHaveBeenCalled();
  });
});
