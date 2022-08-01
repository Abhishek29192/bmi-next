import { fireEvent, render, waitFor } from "@testing-library/react";
import axios from "axios";
import MockDate from "mockdate";
import React from "react";
import * as ClientDownloadUtils from "../../utils/client-download";
import createAssetType from "../../__tests__/helpers/AssetTypeHelper";
import createPimDocument from "../../__tests__/helpers/PimDocumentHelper";
import KeyAssetTypesDownloadSection from "../KeyAssetTypesDownloadSection";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

let isPreviewMode;
let documentDownloadEndpoint;
jest.mock("../../contexts/ConfigProvider", () => ({
  useConfig: () => ({
    config: {
      isPreviewMode,
      documentDownloadEndpoint
    }
  })
}));

const devLog = jest.fn();
jest.mock("../../utils/devLog", () => ({
  devLog: (...args) => devLog(...args)
}));

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
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
      <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
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
          assetType: document.assetType.pimCode,
          documents: [document]
        }
      ];

      const { getByTestId } = render(
        <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
      );

      const downloadButton = getByTestId(
        `${document.assetType.pimCode}Download`
      );

      expect((downloadButton as HTMLAnchorElement).href).toEqual(document.url);
      expect(executeRecaptcha).not.toHaveBeenCalled();
      expect(mockedAxios.post).not.toHaveBeenCalled();
      expect(ClientDownloadUtils.downloadAs).not.toHaveBeenCalled();
      expect(window.alert).not.toHaveBeenCalled();
      expect(devLog).not.toHaveBeenCalled();
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
          assetType: document.assetType.pimCode,
          documents: [document]
        }
      ];
      const { getByTestId } = render(
        <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
      );

      const downloadButton = getByTestId(
        `${document.assetType.pimCode}Download`
      );

      expect((downloadButton as HTMLAnchorElement).href).toEqual(
        `https://${document.url}`
      );
      expect(executeRecaptcha).not.toHaveBeenCalled();
      expect(mockedAxios.post).not.toHaveBeenCalled();
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
          assetType: document1.assetType.pimCode,
          documents: [document1, document2]
        }
      ];

      executeRecaptcha.mockResolvedValueOnce("token");
      mockedAxios.post.mockResolvedValueOnce({ data: { url: "url" } });

      const { getByTestId } = render(
        <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
      );

      const downloadButton = getByTestId(
        `${document1.assetType.pimCode}Download`
      );
      fireEvent.click(downloadButton);

      expect(executeRecaptcha).toHaveBeenCalled();
      await waitFor(() =>
        expect(mockedAxios.post).toHaveBeenLastCalledWith(
          "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT",
          {
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
          },
          { headers: { "X-Recaptcha-Token": "token" }, responseType: "text" }
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
          assetType: document1.assetType.pimCode,
          documents: [document1, document2]
        }
      ];
      isPreviewMode = true;

      const { getByTestId } = render(
        <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
      );

      const downloadButton = getByTestId(
        `${document1.assetType.pimCode}Download`
      );
      fireEvent.click(downloadButton);

      expect(executeRecaptcha).not.toHaveBeenCalled();
      expect(mockedAxios.post).not.toHaveBeenCalled();
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
          assetType: document1.assetType.pimCode,
          documents: [document1, document2]
        }
      ];
      documentDownloadEndpoint = undefined;

      const { getByTestId } = render(
        <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
      );

      const downloadButton = getByTestId(
        `${document1.assetType.pimCode}Download`
      );
      fireEvent.click(downloadButton);

      expect(executeRecaptcha).not.toHaveBeenCalled();
      expect(mockedAxios.post).not.toHaveBeenCalled();
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
          assetType: document1.assetType.pimCode,
          documents: [document1, document2]
        }
      ];
      executeRecaptcha.mockResolvedValueOnce("token");
      mockedAxios.post.mockRejectedValue(Error("Expected Error"));

      const { getByTestId } = render(
        <KeyAssetTypesDownloadSection keyAssetDocuments={assetDocuments} />
      );

      const downloadButton = getByTestId(
        `${document1.assetType.pimCode}Download`
      );
      fireEvent.click(downloadButton);

      expect(executeRecaptcha).toHaveBeenCalled();
      await waitFor(() =>
        expect(mockedAxios.post).toHaveBeenLastCalledWith(
          "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT",
          {
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
          },
          { headers: { "X-Recaptcha-Token": "token" }, responseType: "text" }
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
