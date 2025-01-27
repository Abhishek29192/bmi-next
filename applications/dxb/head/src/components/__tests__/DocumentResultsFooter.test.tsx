import {
  DownloadListContext,
  DownloadListContextType
} from "@bmi-digital/components/download-list";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from "@testing-library/react";
import MockDate from "mockdate";
import React from "react";
import createContentfulDocument from "../../__tests__/helpers/ContentfulDocumentHelper";
import createPimDocument from "../../__tests__/helpers/PimDocumentHelper";
import { Config } from "../../contexts/ConfigProvider";
import * as ClientDownloadUtils from "../../utils/client-download";
import { devLog } from "../../utils/devLog";
import * as utils from "../../utils/documentUtils";
import DocumentResultsFooter, {
  handleDownloadClick
} from "../DocumentResultsFooter";

jest.mock("../../utils/devLog");

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

jest.spyOn(Date.prototype, "getDate").mockReturnValue(0);

const TEST_DATE = new Date(0);

MockDate.set(TEST_DATE);

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
  name3: createPimDocument()
};
const allListItemsWithPages = {
  name1: createContentfulDocument(),
  name2: createPimDocument(),
  name3: createPimDocument()
};
const token = "token";
const ENV = process.env;
const mockedWindowDocumentCookie = jest.spyOn(window.document, "cookie", "get");
const qaAuthToken = "qaAuthToken";

describe("DocumentResultsFooter component", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  afterEach(() => {
    process.env = ENV;
  });

  const downloadListDefaultProps = {
    list,
    allListItemsWithPages,
    updateList: jest.fn(),
    updateAllListItems: jest.fn(),
    resetList: jest.fn(),
    resetAllListItems: jest.fn(),
    selectedAllCheckboxDisabledByPages: { 0: false },
    selectedAllCheckboxCheckedByPages: { 0: false },
    count: 0,
    size: 0,
    totalSize: 0,
    remainingSize: Infinity,
    isLoading: false,
    setIsLoading: jest.fn(),
    currentPage: 0,
    setCurrentPage: jest.fn(),
    setSelectAllCheckboxDisabledByPage: jest.fn(),
    setSelectAllCheckboxCheckedByPage: jest.fn()
  };

  const getWrappeedFooterComponent = (
    props: Partial<DownloadListContextType>,
    children: React.ReactNode
  ) => {
    return (
      <ThemeProvider>
        <DownloadListContext.Provider
          value={{
            ...downloadListDefaultProps,
            ...props
          }}
        >
          {children}
        </DownloadListContext.Provider>
      </ThemeProvider>
    );
  };

  it("renders correctly", () => {
    const handlePageChange = jest.fn();

    const { container } = render(
      getWrappeedFooterComponent(
        {
          list,
          count: 4,
          size: 30
        },
        <DocumentResultsFooter
          page={1}
          count={1}
          onPageChange={handlePageChange}
        />
      )
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if there are no selected documents", () => {
    const handlePageChange = jest.fn();
    render(
      getWrappeedFooterComponent(
        {
          list: {},
          count: 0,
          size: 0
        },
        <DocumentResultsFooter
          page={1}
          count={1}
          onPageChange={handlePageChange}
        />
      )
    );

    expect(screen.getByTestId("document-results-footer")).toBeInTheDocument();
    expect(
      screen.queryByTestId("document-results-footer-total-size-value")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("document-results-footer-max-size-value")
    ).not.toBeInTheDocument();
  });

  it("renders correctly if there are selected documents", () => {
    const handlePageChange = jest.fn();
    render(
      getWrappeedFooterComponent(
        {
          list: { "test-document": createPimDocument() },
          count: 1,
          size: 10
        },
        <DocumentResultsFooter
          page={1}
          count={1}
          onPageChange={handlePageChange}
        />
      )
    );
    expect(
      screen.getByTestId("document-results-footer-total-size-value")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("document-results-footer-max-size-value")
    ).toBeInTheDocument();
  });

  it("renders correctly if the maximum allowed size is exceeded", () => {
    const handlePageChange = jest.fn();
    render(
      getWrappeedFooterComponent(
        {
          list: { "test-document": createPimDocument() },
          updateList: jest.fn(),
          resetList: jest.fn(),
          count: 1,
          size: 200,
          remainingSize: -0.1,
          isLoading: false,
          setIsLoading: jest.fn()
        },
        <DocumentResultsFooter
          page={1}
          count={1}
          onPageChange={handlePageChange}
        />
      )
    );
    expect(
      screen.getByTestId("document-results-footer-size-exceeded-error")
    ).toBeInTheDocument();
  });

  it("renders correctly if download item is array", () => {
    const handlePageChange = jest.fn();
    const customList = {
      name1: [createPimDocument()],
      name2: [createPimDocument({ id: "pim-document-id" })]
    };
    const { container } = render(
      getWrappeedFooterComponent(
        {
          size: 20,
          list: customList,
          updateList: jest.fn(),
          resetList: jest.fn(),
          count: 2,
          remainingSize: Infinity,
          isLoading: false,
          setIsLoading: jest.fn()
        },
        <DocumentResultsFooter
          page={1}
          count={1}
          onPageChange={handlePageChange}
        />
      )
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if onDownloadClick not passed", () => {
    const handlePageChange = jest.fn();
    const { container } = render(
      getWrappeedFooterComponent(
        {
          list,
          updateList: jest.fn(),
          resetList: jest.fn(),
          count: 4,
          size: 0,
          remainingSize: Infinity,
          isLoading: false,
          setIsLoading: jest.fn()
        },
        <DocumentResultsFooter
          page={1}
          count={1}
          onPageChange={handlePageChange}
          isDownloadButton={false}
        />
      )
    );
    expect(container).toMatchSnapshot();
  });

  it("should execute onDownloadClick correctly", async () => {
    const handlePageChange = jest.fn();
    render(
      getWrappeedFooterComponent(
        {
          list,
          updateList: jest.fn(),
          resetList: jest.fn(),
          count: 3,
          size: 10,
          remainingSize: Infinity,
          isLoading: false,
          setIsLoading: jest.fn()
        },
        <DocumentResultsFooter
          page={1}
          count={1}
          onPageChange={handlePageChange}
        />
      )
    );

    executeRecaptcha.mockReturnValue("token");
    const downloadButton = await screen.findByText(
      "MC: downloadList.download (3)"
    );
    fireEvent.click(downloadButton);
    expect(executeRecaptcha).toHaveBeenCalledTimes(1);
  });

  it("should not call executeRecaptcha if qaAuthToken exists", async () => {
    const handlePageChange = jest.fn();
    mockedWindowDocumentCookie.mockReturnValueOnce(
      `qaAuthToken=${qaAuthToken}`
    );

    render(
      getWrappeedFooterComponent(
        {
          list,
          updateList: jest.fn(),
          resetList: jest.fn(),
          count: 3,
          size: 10,
          remainingSize: Infinity,
          isLoading: false,
          setIsLoading: jest.fn()
        },
        <DocumentResultsFooter
          page={1}
          count={1}
          onPageChange={handlePageChange}
        />
      )
    );

    const downloadButton = await screen.findByText(
      "MC: downloadList.download (3)"
    );
    fireEvent.click(downloadButton);
    expect(executeRecaptcha).not.toHaveBeenCalled();
  });

  it("renders sticky footer", () => {
    render(
      getWrappeedFooterComponent(
        {
          list,
          updateList: jest.fn(),
          resetList: jest.fn(),
          count: 3,
          size: 0,
          remainingSize: Infinity,
          isLoading: false,
          setIsLoading: jest.fn()
        },
        <DocumentResultsFooter
          page={1}
          count={1}
          onPageChange={jest.fn()}
          sticky
        />
      )
    );

    expect(screen.getByTestId("document-results-footer")).toHaveStyle({
      position: "sticky"
    });
  });

  describe("handleDownloadClick", () => {
    it("should prevent throw an error if GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT is not set", async () => {
      const actual_GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT =
        process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT;
      delete process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT;

      await handleDownloadClick(
        list,
        { isPreviewMode: false, documentDownloadEndpoint: undefined } as Config,
        resetList,
        token
      );

      expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledTimes(0);
      expect(devLog).toHaveBeenCalledWith(
        "DocumentResults: `GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
      );
      process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT =
        actual_GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT;
    });

    it("should download files", async () => {
      fetchMock.mockResolvedValueOnce(getFetchResponse({ url: "url" }));

      await handleDownloadClick(
        list,
        {
          isPreviewMode: false,
          documentDownloadEndpoint: "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT"
        } as Config,
        resetList,
        token
      );

      await waitFor(() =>
        expect(fetchMock).toHaveBeenLastCalledWith(
          "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT",
          {
            method: "POST",
            body: JSON.stringify({
              documents: [
                {
                  href: "http://doesnot-exist.com/fileName",
                  name: "contentful-document-title.fileName"
                },
                {
                  href: "http://pimDocument",
                  name: "Pim Document-1.pdf"
                },
                {
                  href: "http://pimDocument",
                  name: "Pim Document-2.pdf"
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

      await waitFor(() =>
        expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledWith(
          "url",
          "BMI_19700101000000.zip"
        )
      );

      expect(resetList).toHaveBeenCalledTimes(1);
    });

    it("should download files if qaAuthToken exists", async () => {
      fetchMock.mockResolvedValueOnce(getFetchResponse({ url: "url" }));

      await handleDownloadClick(
        list,
        {
          isPreviewMode: false,
          documentDownloadEndpoint: "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT"
        } as Config,
        resetList,
        undefined,
        qaAuthToken
      );

      await waitFor(() =>
        expect(fetchMock).toHaveBeenLastCalledWith(
          "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT",
          {
            method: "POST",
            body: JSON.stringify({
              documents: [
                {
                  href: "http://doesnot-exist.com/fileName",
                  name: "contentful-document-title.fileName"
                },
                {
                  href: "http://pimDocument",
                  name: "Pim Document-1.pdf"
                },
                {
                  href: "http://pimDocument",
                  name: "Pim Document-2.pdf"
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

      await waitFor(() =>
        expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledWith(
          "url",
          "BMI_19700101000000.zip"
        )
      );

      expect(resetList).toHaveBeenCalledTimes(1);
    });

    it("should not download empty list", async () => {
      await handleDownloadClick(
        {},
        {
          isPreviewMode: false,
          documentDownloadEndpoint: "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT"
        } as Config,
        resetList,
        token
      );
      expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledTimes(0);
    });

    it("should prevent download on GATSBY_PREVIEW", async () => {
      jest.spyOn(window, "alert").mockImplementation();

      await handleDownloadClick(
        list,
        {
          isPreviewMode: true,
          documentDownloadEndpoint: "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT"
        } as Config,
        resetList,
        token
      );

      expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledTimes(0);
      expect(window.alert).toHaveBeenCalledWith(
        "You cannot download documents on the preview environment."
      );
      expect(resetList).toHaveBeenCalledTimes(1);
    });
  });

  describe("hide pagination", () => {
    it("should hide pagination when page size is 25 or less(PageCount=1)", () => {
      const handlePageChange = jest.fn();
      render(
        getWrappeedFooterComponent(
          {
            list,
            updateList: jest.fn(),
            resetList: jest.fn(),
            count: 3,
            size: 0,
            remainingSize: Infinity,
            isLoading: false,
            setIsLoading: jest.fn()
          },
          <DocumentResultsFooter
            page={1}
            count={1}
            onPageChange={handlePageChange}
          />
        )
      );
      expect(screen.queryByTestId("pagination-root")).not.toBeInTheDocument();
    });

    it("should show pagination when page size is more than 25(PageCount>1)", () => {
      const handlePageChange = jest.fn();

      render(
        getWrappeedFooterComponent(
          {
            list,
            updateList: jest.fn(),
            resetList: jest.fn(),
            count: 26,
            size: 0,
            remainingSize: Infinity,
            isLoading: false,
            setIsLoading: jest.fn()
          },
          <DocumentResultsFooter
            page={1}
            count={2}
            onPageChange={handlePageChange}
          />
        )
      );
      expect(screen.getByTestId("pagination-root")).toBeInTheDocument();
    });

    it("should show pagination when page size is more than 25(PageCount>1) and the footer is sticky", () => {
      const handlePageChange = jest.fn();

      render(
        getWrappeedFooterComponent(
          {
            list,
            count: 26,
            size: 0
          },
          <DocumentResultsFooter
            page={1}
            count={2}
            onPageChange={handlePageChange}
            sticky
          />
        )
      );
      expect(screen.getByTestId("document-results-footer")).toHaveStyle({
        position: "sticky"
      });
      expect(screen.getByTestId("pagination-root")).toBeInTheDocument();
    });
  });

  describe("Select all checkbox", () => {
    const downloadListProps = {
      list,
      count: 26,
      size: 0,
      allListItemsWithPages
    };

    const footerProps = {
      page: 1,
      count: 2,
      onPageChange: jest.fn(),
      sticky: true
    };

    let useShowMobileSpy;
    beforeEach(() => {
      useShowMobileSpy = jest.spyOn(utils, "useShowMobileTable");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should render select all when mobile view", () => {
      useShowMobileSpy.mockReturnValueOnce({
        showMobileTable: true,
        handleTableSizeChange: jest.fn(),
        ref: null
      });

      render(
        getWrappeedFooterComponent(
          {
            ...downloadListProps
          },
          <DocumentResultsFooter {...footerProps} />
        )
      );

      expect(
        screen.getByTestId("document-table-select-all-footer-checkbox")
      ).toBeInTheDocument();
    });

    it("should hide select all when desktop", () => {
      useShowMobileSpy.mockReturnValueOnce({
        showMobileTable: false,
        handleTableSizeChange: jest.fn(),
        ref: null
      });

      render(
        getWrappeedFooterComponent(
          {
            ...downloadListProps
          },
          <DocumentResultsFooter {...footerProps} />
        )
      );
      expect(
        screen.queryByTestId("document-table-select-all-footer-checkbox")
      ).not.toBeInTheDocument();
    });

    it("select all disabled when linkedDocs", async () => {
      useShowMobileSpy.mockReturnValueOnce({
        showMobileTable: true,
        handleTableSizeChange: jest.fn(),
        ref: null
      });

      render(
        <ThemeProvider>
          <DownloadListContext.Provider
            value={{
              ...downloadListDefaultProps,
              selectedAllCheckboxDisabledByPages: { 0: true }
            }}
          >
            <DocumentResultsFooter {...footerProps} />
          </DownloadListContext.Provider>
        </ThemeProvider>
      );

      const selectAllCheckbox = within(
        screen.getByTestId("document-table-select-all-footer-checkbox")
      ).getByRole("checkbox");

      fireEvent.click(selectAllCheckbox);

      expect(selectAllCheckbox).toBeDisabled();
    });
  });
});
