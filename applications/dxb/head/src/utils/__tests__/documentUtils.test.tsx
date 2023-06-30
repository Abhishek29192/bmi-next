import { mockResponses } from "@bmi-digital/fetch-mocks";
import logger from "@bmi-digital/functions-logger";
import React from "react";
import {
  createContentfulDocument,
  createPimProductDocument as createESPimProductDocument,
  createPimProductDocument
} from "@bmi/elasticsearch-types";
import fetchMockJest from "fetch-mock-jest";
import mediaQuery from "css-mediaquery";
import { waitFor } from "@testing-library/react";
import { screen, render } from "@testing-library/react";
import createPimDocument, {
  createPseudoZipDocument
} from "../../__tests__/helpers/PimDocumentHelper";
import createPimSystemDocument from "../../__tests__/helpers/PimSystemDocumentHelper";
import { ProductDocument as PIMDocument } from "../../types/pim";
import { downloadAs } from "../client-download";
import {
  downloadMultipleFiles,
  getFileSizeByDocumentType,
  getFileUrlByDocumentType,
  getIsLinkDocument,
  getProductStatus,
  getValidityDate,
  mapAssetToFileDownload,
  useShowMobileTable
} from "../documentUtils";
import { renderHookWithProviders } from "../../__tests__/renderHookWithProviders";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => {
  const original = jest.requireActual("node-fetch");
  return {
    ...original,
    __esModule: true,
    default: (...config) => fetchMock(...config)
  };
});

jest.mock("@bmi-digital/functions-logger", () => ({
  __esModule: true,
  default: {
    error: jest.fn()
  }
}));

jest.mock("../client-download", () => {
  const actual = jest.requireActual("../client-download");
  return {
    ...actual,
    downloadAs: jest.fn()
  };
});

beforeEach(() => {
  fetchMock.reset();
  jest.clearAllMocks();
});

describe("getIsLinkDocument", () => {
  it("should return true if the document has the 'isLinkDocument' property and its value is true", () => {
    const pimLinkDocument: PIMDocument = createPimDocument({
      isLinkDocument: true
    });
    expect(getIsLinkDocument(pimLinkDocument)).toBe(true);
  });

  it("should return false if the document does not have the 'isLinkDocument' property", () => {
    const pimLinkDocument: PIMDocument = createPimDocument({});
    expect(getIsLinkDocument(pimLinkDocument)).toBe(false);
  });

  it("should return false if the 'isLinkDocument' property is present but its value is false", () => {
    const pimLinkDocument: PIMDocument = createPimDocument({
      isLinkDocument: false
    });
    expect(getIsLinkDocument(pimLinkDocument)).toBe(false);
  });
});

describe("getFileUrlByDocumentType", () => {
  it("returns undefined i document is  PIMDocumentWithPseudoZip", () => {
    const document = createPseudoZipDocument();
    const url = getFileUrlByDocumentType(document);
    expect(url).toBeUndefined();
  });

  it("returns correct url for PIM product document", () => {
    const document = createPimProductDocument({ url: "https://fake-url" });
    const url = getFileUrlByDocumentType(document);
    expect(url).toBe(document.url);
  });

  it("returns correct url for Contentful document", () => {
    const document = createContentfulDocument({
      asset: {
        file: {
          url: "https://fake-url",
          fileName: "asset-filename.jpg",
          contentType: "image/jpeg",
          details: {
            size: 1
          }
        }
      }
    });
    const url = getFileUrlByDocumentType(document);
    expect(url).toBe(document.asset.file.url);
  });
});

describe("getFileSizeByDocumentType", () => {
  it("returns correct file size for Contentful document", () => {
    const document = createContentfulDocument({
      asset: {
        file: {
          url: "https://fake-url",
          fileName: "asset-filename.jpg",
          contentType: "image/jpeg",
          details: {
            size: 100
          }
        }
      }
    });

    const fileSize = getFileSizeByDocumentType(document);
    expect(fileSize).toBe(100);
  });

  it("returns correct file size for Product document", () => {
    const document = createPimProductDocument({ fileSize: 100 });
    const fileSize = getFileSizeByDocumentType(document);
    expect(fileSize).toBe(100);
  });
});

describe("getProductStatus", () => {
  it("should return '-'", () => {
    const document = createESPimProductDocument();
    delete document.approvalStatus;
    const productStatus = getProductStatus(document, jest.fn());
    expect(productStatus).toBe("-");
  });

  it("should return status 'Available'", () => {
    const getMicroCopy = jest.fn();
    const document = createESPimProductDocument({ approvalStatus: "approved" });
    getProductStatus(document, getMicroCopy);
    expect(getMicroCopy).toHaveBeenCalledWith("document.status.available");
  });

  it("should return status 'Discontinued'", () => {
    const getMicroCopy = jest.fn();
    const document = createESPimProductDocument({
      approvalStatus: "discontinued"
    });
    getProductStatus(document, getMicroCopy);
    expect(getMicroCopy).toHaveBeenCalledWith("document.status.discontinued");
  });
});

describe("getValidityDate", () => {
  it("should return '-'", () => {
    const document = createESPimProductDocument();
    delete document.validUntil;
    const formattedDate = getValidityDate(document);
    expect(formattedDate).toBe("-");

    document.validUntil = undefined;
    expect(formattedDate).toBe("-");
  });

  it("should return date in correct format", () => {
    const document = createESPimProductDocument({
      validUntil: new Date("2023-10-27T08:23:59+0000").getTime()
    });
    const formattedDate = getValidityDate(document);
    expect(formattedDate).toBe("27.10.2023");
  });
});

describe("downloadMultipleFiles", () => {
  it("throws an error if GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT does not exist", async () => {
    const initialValue = process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT;
    process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT = "";
    const document = createPseudoZipDocument();
    await downloadMultipleFiles(document, "", jest.fn());

    expect(logger.error).toHaveBeenCalled();
    process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT = initialValue;
  });

  it("downloads files successfully", async () => {
    const initialValue = process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT;
    process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT = "https://fake-endpoint";
    mockResponses(fetchMock, {
      url: "*",
      method: "POST",
      status: 200,
      body: { ok: true }
    });
    const document = createPseudoZipDocument();
    await downloadMultipleFiles(document, "", jest.fn());

    expect(downloadAs).toHaveBeenCalled();
    process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOIN = initialValue;
  });

  it("sends a request with authorization header if qaAuthToken exists", async () => {
    const initialValue = process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT;
    process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT = "https://fake-edpoint";
    mockResponses(fetchMock, {
      url: "*",
      method: "POST",
      status: 200,
      body: { ok: true }
    });
    const document = createPseudoZipDocument();
    await downloadMultipleFiles(document, "qaAuthToken", jest.fn());

    expect(fetchMock.lastOptions()!.headers!.authorization).toBe(
      "Bearer qaAuthToken"
    );
    process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOIN = initialValue;
  });

  it("throws an error if request fails", async () => {
    const initialValue = process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT;
    process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT = "https://fake-endpoint";
    mockResponses(fetchMock, {
      url: "*",
      method: "POST",
      status: 400,
      body: { ok: false }
    });
    const document = createPseudoZipDocument();
    await downloadMultipleFiles(document, "", jest.fn());

    expect(logger.error).toHaveBeenCalledTimes(1);
    process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOIN = initialValue;
  });
});

describe("mapAssetToFileDownload", () => {
  const expectedCommonProperties = {
    format: "application/pdf",
    size: 10,
    assetTypeName: "asset-name",
    productStatus: "-",
    validUntil: "-"
  };

  it("should map PIMDocument types to FileDownloadButtonProps correctly", () => {
    const document = createPimDocument();
    const getMicroCopy = jest.fn();
    expect(mapAssetToFileDownload(document, getMicroCopy)).toEqual({
      ...expectedCommonProperties,
      title: "Pim Document",
      url: "http://pimDocument",
      isLinkDocument: false
    });
  });

  it("should map PIMSystemDocument types to FileDownloadButtonProps correctly", () => {
    const document = createPimSystemDocument();
    const getMicroCopy = jest.fn();
    expect(mapAssetToFileDownload(document, getMicroCopy)).toEqual({
      ...expectedCommonProperties,
      title: "pim-link-document-title",
      url: "http://localhost/pim-link-document-id",
      isLinkDocument: true
    });
  });
});

describe("useShowMobileTable", () => {
  const createMatchMedia = (width: number) => {
    return (query: string): MediaQueryList =>
      ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {}
      } as unknown as MediaQueryList);
  };

  afterEach(() => {
    window.matchMedia = createMatchMedia(1200);
  });

  it("returns true for devices smaller than 840px", () => {
    window.matchMedia = createMatchMedia(839);
    const { result } = renderHookWithProviders(useShowMobileTable);
    expect(result.current.showMobileTable).toBeTruthy();
  });

  it("returns correct value if table's width is greater than container's width", async () => {
    const { result } = renderHookWithProviders(useShowMobileTable);
    render(
      <div data-testid="container" ref={result.current.ref}>
        Container
      </div>
    );
    result.current.handleTableSizeChange("medium", 651);
    const container = screen.getByTestId("container");
    Object.defineProperty(container, "offsetWidth", { value: 650 });

    await waitFor(() => expect(result.current.showMobileTable).toBeTruthy());
  });

  it("returns correct value on resize event", async () => {
    const { result } = renderHookWithProviders(useShowMobileTable);
    render(
      <div data-testid="container" ref={result.current.ref}>
        Container
      </div>
    );
    result.current.handleTableSizeChange("medium", 651);
    const container = screen.getByTestId("container");
    Object.defineProperty(container, "offsetWidth", {
      value: 650,
      writable: true
    });
    await waitFor(() => expect(result.current.showMobileTable).toBeTruthy());

    Object.defineProperty(container, "offsetWidth", { value: 655 });
    const event = new Event("resize");
    window.dispatchEvent(event);
    await waitFor(() => expect(result.current.showMobileTable).toBeFalsy());
  });
});
