import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MockDate from "mockdate";
import React from "react";
import createAssetType from "../../__tests__/helpers/AssetTypeHelper";
import createPimDocument from "../../__tests__/helpers/PimDocumentHelper";
import * as ClientDownloadUtils from "../../utils/client-download";
import KeyAssetTypesDownloadSection from "../KeyAssetTypesDownloadSection";

const fetchMock = jest.fn();
jest.mock("node-fetch", () => {
  const original = jest.requireActual("node-fetch");
  return {
    ...original,
    __esModule: true,
    default: (...config: unknown[]) => fetchMock(...config)
  };
});

const getFetchResponse = (response: unknown) => ({
  ok: true,
  json: () => response
});

// Needed to mock only one method of module
jest.spyOn(ClientDownloadUtils, "downloadAs").mockImplementation();

jest.spyOn(window, "alert").mockImplementation();

jest.spyOn(Date.prototype, "getDate").mockReturnValue(0);
const TEST_DATE = new Date(0);
MockDate.set(TEST_DATE);

const executeRecaptcha = jest.fn();
jest.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: () => executeRecaptcha()
  })
}));

let isPreviewMode: boolean;
let documentDownloadEndpoint: string | undefined;
jest.mock("../../contexts/ConfigProvider", () => ({
  useConfig: () => ({
    isPreviewMode,
    documentDownloadEndpoint
  })
}));

const devLog = jest.fn();
jest.mock("../../utils/devLog", () => ({
  devLog: (...args: unknown[]) => devLog(...args)
}));

const mockedWindowDocumentCookie = jest.spyOn(window.document, "cookie", "get");
const qaAuthToken = "qaAuthToken";

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  isPreviewMode = false;
  documentDownloadEndpoint = "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT";
});

describe("KeyAssetTypesDownloadSection component", () => {
  it("renders correctly", () => {
    const document1 = createPimDocument({
      assetType: createAssetType({ pimCode: "SAT", name: "Some Asset Type" })
    });
    const document2 = createPimDocument({
      assetType: createAssetType({ pimCode: "SAT", name: "Some Asset Type" })
    });
    const document3 = createPimDocument({
      assetType: createAssetType({ pimCode: "AAT", name: "Another Asset Type" })
    });

    const assetDocuments = [
      {
        assetType: "SAT",
        documents: [document1, document2]
      },
      {
        assetType: "AAT",
        documents: [document3]
      }
    ];
    const { container } = render(
      <ThemeProvider>
        <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  describe("handleDownloadClick function", () => {
    it("should render link for single document", async () => {
      const document = createPimDocument({
        url: "http://localhost:8000/document.pdf"
      });
      document.assetType = {
        code: "AAT",
        pimCode: "AAT",
        name: "AAT",
        id: "AAT"
      };
      const assetDocuments = [
        {
          assetType: document.assetType.pimCode!,
          documents: [document]
        }
      ];

      render(
        <ThemeProvider>
          <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
        </ThemeProvider>
      );

      const downloadButton = screen.getByTestId(
        `${document.assetType.pimCode}Download`
      );

      expect((downloadButton as HTMLAnchorElement).href).toEqual(document.url);
      expect(executeRecaptcha).not.toHaveBeenCalled();
      expect(fetchMock).not.toHaveBeenCalled();
      expect(ClientDownloadUtils.downloadAs).not.toHaveBeenCalled();
      expect(window.alert).not.toHaveBeenCalled();
      expect(devLog).not.toHaveBeenCalled();
    });

    it("should open the document in a new tab and apply security attributes to the button", async () => {
      const document = createPimDocument({
        url: "http://localhost:8000/document.pdf"
      });
      document.assetType = {
        code: "AAT",
        pimCode: "AAT",
        name: "AAT",
        id: "AAT"
      };
      const assetDocuments = [
        {
          assetType: document.assetType.pimCode!,
          documents: [document]
        }
      ];

      render(
        <ThemeProvider>
          <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
        </ThemeProvider>
      );

      const downloadButton = screen.getByTestId(
        `${document.assetType.pimCode}Download`
      );

      expect(downloadButton).toHaveAttribute("rel", "noreferrer");
      expect(downloadButton).toHaveAttribute("referrerpolicy", "no-referrer");
      expect(downloadButton).toHaveAttribute("target", "_blank");
    });

    it("should render link with https prefix for single document without protocol", async () => {
      const document = createPimDocument({
        url: "localhost:8000/document.pdf"
      });
      document.assetType = {
        code: "AAT",
        pimCode: "AAT",
        name: "AAT",
        id: "AAT"
      };
      const assetDocuments = [
        {
          assetType: document.assetType.pimCode!,
          documents: [document]
        }
      ];
      render(
        <ThemeProvider>
          <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
        </ThemeProvider>
      );

      const downloadButton = screen.getByTestId(
        `${document.assetType.pimCode}Download`
      );

      expect((downloadButton as HTMLAnchorElement).href).toEqual(
        `https://${document.url}`
      );
      expect(executeRecaptcha).not.toHaveBeenCalled();
      expect(fetchMock).not.toHaveBeenCalled();
      expect(ClientDownloadUtils.downloadAs).not.toHaveBeenCalled();
      expect(window.alert).not.toHaveBeenCalled();
      expect(devLog).not.toHaveBeenCalled();
    });

    it("should download multiple documents of the same asset type as a zip file", async () => {
      const document1 = createPimDocument({
        assetType: createAssetType({ pimCode: "SAT", name: "Some Asset Type" })
      });
      const document2 = createPimDocument({
        assetType: createAssetType({ pimCode: "SAT", name: "Some Asset Type" })
      });

      const assetDocuments = [
        {
          assetType: document1.assetType.pimCode!,
          documents: [document1, document2]
        }
      ];

      executeRecaptcha.mockResolvedValueOnce("token");
      fetchMock.mockReturnValueOnce(getFetchResponse({ url: "url" }));

      render(
        <ThemeProvider>
          <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
        </ThemeProvider>
      );

      const downloadButton = screen.getByTestId(
        `${document1.assetType.pimCode}Download`
      );
      fireEvent.click(downloadButton);

      expect(executeRecaptcha).toHaveBeenCalled();
      await waitFor(() =>
        expect(fetchMock).toHaveBeenLastCalledWith(
          "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT",
          {
            method: "POST",
            body: JSON.stringify({
              documents: [
                {
                  href: document1.url,
                  name: document1.title
                },
                {
                  href: document2.url,
                  name: document2.title
                }
              ]
            }),
            headers: {
              "Content-Type": "application/json",
              "X-Recaptcha-Token": "token",
              authorization: undefined
            }
          }
        )
      );
      expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledWith(
        "url",
        "BMI_19700101000000.zip"
      );
      expect(window.alert).not.toHaveBeenCalled();
      expect(devLog).not.toHaveBeenCalled();
    });

    it("should download documents without recaptcha with qa token", async () => {
      mockedWindowDocumentCookie.mockReturnValueOnce(
        `qaAuthToken=${qaAuthToken}`
      );
      const document1 = createPimDocument({
        assetType: createAssetType({ pimCode: "SAT", name: "Some Asset Type" })
      });
      const document2 = createPimDocument({
        assetType: createAssetType({ pimCode: "SAT", name: "Some Asset Type" })
      });

      const assetDocuments = [
        {
          assetType: document1.assetType.pimCode!,
          documents: [document1, document2]
        }
      ];

      fetchMock.mockReturnValueOnce(getFetchResponse({ url: "url" }));

      render(
        <ThemeProvider>
          <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
        </ThemeProvider>
      );

      const downloadButton = screen.getByTestId(
        `${document1.assetType.pimCode}Download`
      );
      fireEvent.click(downloadButton);

      expect(executeRecaptcha).not.toHaveBeenCalled();
      await waitFor(() =>
        expect(fetchMock).toHaveBeenLastCalledWith(
          "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT",
          {
            method: "POST",
            body: JSON.stringify({
              documents: [
                {
                  href: document1.url,
                  name: document1.title
                },
                {
                  href: document2.url,
                  name: document2.title
                }
              ]
            }),
            headers: {
              "Content-Type": "application/json",
              "X-Recaptcha-Token": undefined,
              authorization: `Bearer ${qaAuthToken}`
            }
          }
        )
      );
      expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledWith(
        "url",
        "BMI_19700101000000.zip"
      );
      expect(window.alert).not.toHaveBeenCalled();
      expect(devLog).not.toHaveBeenCalled();
    });

    it("should prevent download on preview mode", async () => {
      const document1 = createPimDocument({
        assetType: createAssetType({ pimCode: "SAT", name: "Some Asset Type" })
      });
      const document2 = createPimDocument({
        assetType: createAssetType({ pimCode: "SAT", name: "Some Asset Type" })
      });

      const assetDocuments = [
        {
          assetType: document1.assetType.pimCode!,
          documents: [document1, document2]
        }
      ];
      isPreviewMode = true;

      render(
        <ThemeProvider>
          <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
        </ThemeProvider>
      );

      const downloadButton = screen.getByTestId(
        `${document1.assetType.pimCode}Download`
      );
      fireEvent.click(downloadButton);

      expect(executeRecaptcha).not.toHaveBeenCalled();
      expect(fetchMock).not.toHaveBeenCalled();
      expect(ClientDownloadUtils.downloadAs).not.toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(
        "You cannot download documents on the preview environment."
      );
      expect(devLog).not.toHaveBeenCalled();
    });

    it("should prevent download when endpoint not provided", async () => {
      const document1 = createPimDocument({
        assetType: createAssetType({ pimCode: "SAT", name: "Some Asset Type" })
      });
      const document2 = createPimDocument({
        assetType: createAssetType({ pimCode: "SAT", name: "Some Asset Type" })
      });

      const assetDocuments = [
        {
          assetType: document1.assetType.pimCode!,
          documents: [document1, document2]
        }
      ];
      documentDownloadEndpoint = undefined;

      render(
        <ThemeProvider>
          <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
        </ThemeProvider>
      );

      const downloadButton = screen.getByTestId(
        `${document1.assetType.pimCode}Download`
      );
      fireEvent.click(downloadButton);

      expect(executeRecaptcha).not.toHaveBeenCalled();
      expect(fetchMock).not.toHaveBeenCalled();
      expect(ClientDownloadUtils.downloadAs).not.toHaveBeenCalled();
      expect(window.alert).not.toHaveBeenCalled();
      expect(devLog).not.toHaveBeenCalled();
    });

    it("should log error if download fails", async () => {
      const document1 = createPimDocument({
        assetType: createAssetType({ pimCode: "SAT", name: "Some Asset Type" })
      });
      const document2 = createPimDocument({
        assetType: createAssetType({ pimCode: "SAT", name: "Some Asset Type" })
      });
      const assetDocuments = [
        {
          assetType: document1.assetType.pimCode!,
          documents: [document1, document2]
        }
      ];
      executeRecaptcha.mockResolvedValueOnce("token");
      fetchMock.mockRejectedValue(Error("Expected Error"));

      render(
        <ThemeProvider>
          <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
        </ThemeProvider>
      );

      const downloadButton = screen.getByTestId(
        `${document1.assetType.pimCode}Download`
      );
      fireEvent.click(downloadButton);

      expect(executeRecaptcha).toHaveBeenCalled();
      await waitFor(() =>
        expect(fetchMock).toHaveBeenLastCalledWith(
          "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT",
          {
            method: "POST",
            body: JSON.stringify({
              documents: [
                {
                  href: document1.url,
                  name: document1.title
                },
                {
                  href: document2.url,
                  name: document2.title
                }
              ]
            }),
            headers: {
              "Content-Type": "application/json",
              "X-Recaptcha-Token": "token",
              authorization: undefined
            }
          }
        )
      );

      expect(ClientDownloadUtils.downloadAs).not.toHaveBeenCalled();
      expect(window.alert).not.toHaveBeenCalled();
      expect(devLog).toHaveBeenCalledWith(
        "KeyAssetTypesDownloadSection",
        Error("Expected Error")
      );
    });

    it("should log error if download fails without recapthca call", async () => {
      mockedWindowDocumentCookie.mockReturnValueOnce(
        `qaAuthToken=${qaAuthToken}`
      );
      const document1 = createPimDocument({
        assetType: createAssetType({ pimCode: "SAT", name: "Some Asset Type" })
      });
      const document2 = createPimDocument({
        assetType: createAssetType({ pimCode: "SAT", name: "Some Asset Type" })
      });
      const assetDocuments = [
        {
          assetType: document1.assetType.pimCode!,
          documents: [document1, document2]
        }
      ];
      fetchMock.mockRejectedValue(Error("Expected Error"));

      render(
        <ThemeProvider>
          <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
        </ThemeProvider>
      );

      const downloadButton = screen.getByTestId(
        `${document1.assetType.pimCode}Download`
      );
      fireEvent.click(downloadButton);

      expect(executeRecaptcha).not.toHaveBeenCalled();
      await waitFor(() =>
        expect(fetchMock).toHaveBeenLastCalledWith(
          "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT",
          {
            method: "POST",
            body: JSON.stringify({
              documents: [
                {
                  href: document1.url,
                  name: document1.title
                },
                {
                  href: document2.url,
                  name: document2.title
                }
              ]
            }),
            headers: {
              "Content-Type": "application/json",
              "X-Recaptcha-Token": undefined,
              authorization: `Bearer ${qaAuthToken}`
            }
          }
        )
      );

      expect(ClientDownloadUtils.downloadAs).not.toHaveBeenCalled();
      expect(window.alert).not.toHaveBeenCalled();
      expect(devLog).toHaveBeenCalledWith(
        "KeyAssetTypesDownloadSection",
        Error("Expected Error")
      );
    });
  });
});
