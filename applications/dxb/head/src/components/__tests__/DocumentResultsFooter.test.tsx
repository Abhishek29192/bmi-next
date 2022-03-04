import React from "react";
import axios from "axios";
import { render, fireEvent, waitFor } from "@testing-library/react";
import MockDate from "mockdate";
import { DownloadListContext } from "@bmi/components";
import DocumentResultsFooter, {
  handleDownloadClick
} from "../DocumentResultsFooter";
import createContentfulDocument from "../../__tests__/ContentfulDocumentHelper";
import createPimDocument from "../../__tests__/PimDocumentHelper";
import createSdpDocument from "../../__tests__/SdpDocumentHelper";
import * as ClientDownloadUtils from "../../utils/client-download";
import { devLog } from "../../utils/devLog";

jest.mock("axios");
jest.mock("../../utils/devLog");

// Needed to mock only one method of module
jest.spyOn(ClientDownloadUtils, "downloadAs").mockImplementation();

jest.spyOn(Date.prototype, "getDate").mockReturnValue(0);

const TEST_DATE = new Date(0);

MockDate.set(TEST_DATE);

const mockedAxios = axios as jest.Mocked<typeof axios>;

const executeRecaptcha = jest.fn();

jest.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha
  })
}));

const resetList = jest.fn();
const list = {
  name1: createContentfulDocument(),
  name2: createPimDocument(),
  name3: createSdpDocument()
};
const token = "token";
const ENV = process.env;

describe("DocumentResultsFooter component", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  afterEach(() => {
    process.env = ENV;
  });

  it("renders correctly", () => {
    const handleDownloadClickMock = jest.fn();
    const handlePageChange = jest.fn();
    const { container } = render(
      <DownloadListContext.Provider
        value={{
          list,
          updateList: jest.fn(),
          resetList: jest.fn(),
          count: 4,
          remainingSize: Infinity,
          isLoading: false,
          setIsLoading: jest.fn()
        }}
      >
        <DocumentResultsFooter
          page={1}
          count={1}
          onDownloadClick={handleDownloadClickMock}
          onPageChange={handlePageChange}
        />
      </DownloadListContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if download item is array", () => {
    const handleDownloadClickMock = jest.fn();
    const handlePageChange = jest.fn();
    const customList = {
      name1: [createPimDocument()],
      name2: [createSdpDocument()]
    };
    const { container } = render(
      <DownloadListContext.Provider
        value={{
          list: customList,
          updateList: jest.fn(),
          resetList: jest.fn(),
          count: 2,
          remainingSize: Infinity,
          isLoading: false,
          setIsLoading: jest.fn()
        }}
      >
        <DocumentResultsFooter
          page={1}
          count={1}
          onDownloadClick={handleDownloadClickMock}
          onPageChange={handlePageChange}
        />
      </DownloadListContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if onDownloadClick not passed", () => {
    const handlePageChange = jest.fn();
    const { container } = render(
      <DownloadListContext.Provider
        value={{
          list,
          updateList: jest.fn(),
          resetList: jest.fn(),
          count: 4,
          remainingSize: Infinity,
          isLoading: false,
          setIsLoading: jest.fn()
        }}
      >
        <DocumentResultsFooter
          page={1}
          count={1}
          onPageChange={handlePageChange}
        />
      </DownloadListContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should execute onDownloadClick correctly", async () => {
    const handleDownloadClickMock = jest.fn();
    const handlePageChange = jest.fn();
    const { findByText } = render(
      <DownloadListContext.Provider
        value={{
          list,
          updateList: jest.fn(),
          resetList: jest.fn(),
          count: 3,
          remainingSize: Infinity,
          isLoading: false,
          setIsLoading: jest.fn()
        }}
      >
        <DocumentResultsFooter
          page={1}
          count={1}
          onDownloadClick={handleDownloadClickMock}
          onPageChange={handlePageChange}
        />
      </DownloadListContext.Provider>
    );

    executeRecaptcha.mockReturnValue("token");
    const downloadButton = await findByText("MC: downloadList.download (3)");
    fireEvent.click(downloadButton);
    expect(executeRecaptcha).toBeCalledTimes(1);
    waitFor(() => expect(handleDownloadClickMock).toBeCalledTimes(1));
  });

  describe("handleDownloadClick", () => {
    it("should prevent throw an error if GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT is not set", async () => {
      const actual_GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT =
        process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT;
      delete process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT;

      await handleDownloadClick(list, token, resetList);

      expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledTimes(0);
      expect(devLog).toHaveBeenCalledWith(
        "DocumentResults: `GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
      );
      process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT =
        actual_GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT;
    });

    it("should download files", async () => {
      process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT =
        "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT";

      mockedAxios.post.mockResolvedValueOnce({ data: { url: "url" } });

      await handleDownloadClick(list, token, resetList);

      expect(mockedAxios.post).toHaveBeenLastCalledWith(
        "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT",
        {
          documents: [
            {
              href: "http://doesnot-exist.com/fileName",
              name: "contentful-document-title.fileName"
            },
            {
              href: "http://localhost/pim-document-id",
              name: "pim-document-title.pdf"
            },
            {
              href: "http://localhost:8000/sdp-document-file-name.pdf",
              name: "sdp-document-file-name.pdf"
            }
          ]
        },
        { headers: { "X-Recaptcha-Token": "token" }, responseType: "text" }
      );
      expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledWith(
        "url",
        "BMI_19700101000000.zip"
      );
      expect(resetList).toHaveBeenCalledTimes(1);
    });

    it("should not download empty list", async () => {
      await handleDownloadClick({}, token, resetList);
      expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledTimes(0);
    });

    it("should prevent download on GATSBY_PREVIEW", async () => {
      process.env.GATSBY_PREVIEW = "GATSBY_PREVIEW";

      jest.spyOn(window, "alert").mockImplementation();

      await handleDownloadClick(list, token, resetList);

      expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledTimes(0);
      expect(window.alert).toHaveBeenCalledWith(
        "You cannot download documents on the preview enviornment."
      );
      expect(resetList).toHaveBeenCalledTimes(1);
    });
  });
});
