/* eslint-disable prefer-spread */
import { ThemeProvider } from "@bmi/components";
import { fireEvent, RenderResult, waitFor } from "@testing-library/react";
import React from "react";
import DocumentLibraryPage, { PAGE_SIZE } from "../";
import * as documentResultsFooter from "../../../components/DocumentResultsFooter";
import { ConfigProvider, EnvConfig } from "../../../contexts/ConfigProvider";
import { renderWithRouter } from "../../../test/renderWithRouter";
import * as elasticSearch from "../../../utils/elasticSearch";
import { FILTER_KEY } from "../../../utils/filters";
import { DocumentLibraryPageContext } from "../types";
import {
  createCollapseData,
  createData,
  createESDocumentHitResponseMock,
  filtersMock
} from "../__mocks__/index.mock";

const count = PAGE_SIZE;
const executeRecaptchaSpy = jest.fn().mockResolvedValue("RECAPTCHA");
jest.mock("react-google-recaptcha-v3", () => {
  const originalModule = jest.requireActual("react-google-recaptcha-v3");
  return {
    ...originalModule,
    useGoogleReCaptcha: () => ({
      executeRecaptcha: executeRecaptchaSpy
    })
  };
});

const mockQueryES = jest
  .spyOn(elasticSearch, "queryElasticSearch")
  .mockResolvedValue({
    hits: {
      hits: [createESDocumentHitResponseMock()],
      total: {
        value: 1
      }
    }
  });

interface Params {
  pageData?: any;
  pageContext?: DocumentLibraryPageContext;
  mockEnvVariables?: Partial<EnvConfig["config"]>;
  route?: string;
}

const renderWithProviders = ({
  pageData,
  pageContext,
  mockEnvVariables,
  route
}: Params): RenderResult => {
  const defaultPageEnvVars = {
    documentDownloadMaxLimit: 200,
    isPreviewMode: false
  } as Partial<EnvConfig["config"]>;
  const defaultPageContext = {
    pageId: null,
    siteId: null,
    categoryCode: null,
    variantCodeToPathMap: null
  };
  const filters = filtersMock();
  const defaultPageData = createData(filters);
  return renderWithRouter(
    <ThemeProvider>
      <ConfigProvider
        configObject={{ ...defaultPageEnvVars, ...mockEnvVariables }}
      >
        <DocumentLibraryPage
          data={pageData || defaultPageData}
          pageContext={pageContext || defaultPageContext}
        />
      </ConfigProvider>
    </ThemeProvider>,
    { route }
  );
};

jest.setTimeout(30000);

describe("Document Library page", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("renders correctly ", async () => {
    const { container, getByTestId, getByText } = renderWithProviders({});
    expect(container.querySelectorAll("header").length).toBe(1);
    expect(getByTestId("footer")).toBeTruthy();
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(container.querySelector("[class*='Hero']")).toBeTruthy();
    expect(
      container.querySelector("[class*='Hero'] [class*='Breadcrumbs']")
    ).toBeTruthy();
    expect(
      container.querySelector("[class*='white'] .Filters .scroll-bar")
    ).toBeTruthy();
    expect(getByText("MC: documentLibrary.filters.title")).toBeTruthy();
    expect(getByText("MC: documentLibrary.filters.clearAll")).toBeTruthy();
    expect(mockQueryES).toBeCalled();
    expect(
      container.querySelector("[class*='alabaster'][class*='slim']")
    ).toBeTruthy();
    expect(
      container.querySelector(
        "[class*='alabaster'][class*='slim'] [class*='Breadcrumbs']"
      )
    ).toBeTruthy();
  });

  it("renders desription correctly", () => {
    const paragraphText = "this is a test paragraph";
    const raw = {
      nodeType: "document",
      data: {},
      content: [
        {
          nodeType: "paragraph",
          content: [
            {
              nodeType: "text",
              value: paragraphText,
              marks: [],
              data: {}
            }
          ],
          data: {}
        }
      ]
    };

    const richText = {
      raw: JSON.stringify(raw),
      references: [
        {
          __typename: "NonType",
          contentful_id: "3tcysaa3PGMlm42U4WnlmK"
        }
      ]
    };
    const data = createData();
    data.contentfulDocumentLibraryPage.description = richText;
    const { getByText } = renderWithProviders({ pageData: data });

    expect(getByText(paragraphText)).toBeTruthy();
  });

  it("should render DocumentResults and DocumentResultsFooter correctly", async () => {
    const { container } = renderWithProviders({});
    await waitFor(() => expect(mockQueryES).toBeCalled());
    expect(container.querySelector(".DocumentSimpleTableResults")).toBeTruthy();
    expect(
      container.querySelectorAll(".DocumentSimpleTableResults .row").length
    ).toBe(1);
    expect(container.querySelector(".results")).toBeTruthy();
    expect(container.querySelector(".DocumentResultsFooter")).toBeTruthy();
  });

  it("should render DocumentTechnicalTableResults correctly if resultsType === Technical", async () => {
    const collapseData = createCollapseData();
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [createESDocumentHitResponseMock({}, collapseData)],
        total: {
          value: 2
        }
      }
    });
    const { container } = renderWithProviders({
      pageData: createData([], { resultsType: "Technical" })
    });

    await waitFor(() => expect(mockQueryES).toBeCalled());
    expect(
      container.querySelector("[class*=DocumentTechnicalTableResults-root]")
    ).toBeTruthy();
    expect(container.querySelector(`a[href="https://url"]`)).toBeTruthy();
    expect(container.querySelector(".results")).toBeTruthy();
    expect(container.querySelector(".DocumentResultsFooter")).toBeTruthy();
  });

  describe("filters", () => {
    const mockSearchParams = `[{"name":"Brand","value":["BMI_Components"]}]`;
    const mockUrl = `http://localhost:8000/no/documentation-landing-page/all-product-catalogues/`;
    const mockHref = `${mockUrl}?${FILTER_KEY}=${mockSearchParams}`;

    beforeEach(() => {
      jest.clearAllMocks();
      window.history.replaceState = jest.fn();
    });

    it("should set up filters in sidebar if url query params includes filters values on page load", async () => {
      mockQueryES.mockResolvedValueOnce({
        aggregations: {
          unique_documents_count: {
            value: 1
          },
          BRAND: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: "BMI_Components",
                doc_count: 1
              }
            ]
          }
        }
      });

      const { findByLabelText } = renderWithProviders({
        route: mockHref
      });
      expect(mockQueryES).toBeCalled();
      expect(await findByLabelText(/bmi components/i)).toBeChecked();
      expect(mockQueryES).toBeCalled();
    });
    it("should make ES request when user select any filter and update url query params", async () => {
      mockQueryES.mockResolvedValueOnce({
        aggregations: {
          unique_documents_count: {
            value: 1
          },
          BRAND: {
            buckets: [
              {
                key: "BMI_Components",
                doc_count: 1
              }
            ]
          }
        }
      });
      const { queryByText } = renderWithProviders({});

      fireEvent.click(queryByText("BMI Components"));
      expect(mockQueryES).toBeCalledTimes(2);

      await waitFor(() => {
        expect(window.history.replaceState).toBeCalledWith(
          null,
          null,
          `/?filters=${encodeURIComponent(mockSearchParams)}`
        );
      });
    });
    it("should clear filter correctly when click the checked filter", async () => {
      mockQueryES.mockResolvedValueOnce({
        aggregations: {
          unique_documents_count: {
            value: 1
          },
          BRAND: {
            buckets: [
              {
                key: "BMI_Components",
                doc_count: 1
              }
            ]
          }
        }
      });
      const { queryByText } = renderWithProviders({});
      fireEvent.click(queryByText("BMI Components"));
      expect(mockQueryES).toBeCalled();
      await waitFor(() => {
        expect(window.history.replaceState).toBeCalledWith(
          null,
          null,
          `/?${FILTER_KEY}=${encodeURIComponent(mockSearchParams)}`
        );
      });

      fireEvent.click(queryByText("BMI Components"));
      expect(mockQueryES).toBeCalled();
      await waitFor(() => {
        expect(window.history.replaceState).toBeCalledWith(
          null,
          null,
          `/?${FILTER_KEY}=%5B%5D`
        );
      });
    });
    it("should clear all filters correctly when click the clear all button", async () => {
      mockQueryES.mockResolvedValueOnce({
        aggregations: {
          unique_documents_count: {
            value: 1
          },
          BRAND: {
            buckets: [
              {
                key: "BMI_Components",
                doc_count: 1
              }
            ]
          }
        }
      });
      const { getByText, findByLabelText } = renderWithProviders({
        route: mockHref
      });
      expect(mockQueryES).toBeCalled();
      expect(await findByLabelText(/bmi components/i)).toBeChecked();
      fireEvent.click(getByText("MC: documentLibrary.filters.clearAll"));
      expect(window.history.replaceState).toHaveBeenCalledTimes(1);
      expect(mockQueryES).toBeCalled();
      await waitFor(() => {
        expect(window.history.replaceState).toBeCalledWith(null, null, mockUrl);
      });
    });
  });

  it("should show the correct documents after clicking the pagination", async () => {
    jest.spyOn(window, "scrollTo").mockImplementation();
    const mockESDocumentsList = Array.from(Array(count + 1)).map((_, index) =>
      createESDocumentHitResponseMock({
        title: `documentTitle${index}`,
        titleAndSize: `AeroDek_${index}`
      })
    );
    const mockLastEsDocument = mockESDocumentsList.slice(-1);
    mockQueryES
      .mockResolvedValueOnce({
        hits: {
          hits: [...mockESDocumentsList.slice(0, 24)]
        },
        aggregations: {
          unique_documents_count: { value: count + 1 }
        }
      })
      .mockResolvedValueOnce({
        hits: {
          hits: [...mockLastEsDocument]
        },
        aggregations: {
          unique_documents_count: { value: 1 }
        }
      });
    const { container, getByLabelText } = renderWithProviders({});
    await waitFor(() => {
      expect(
        container.querySelectorAll(".DocumentSimpleTableResults .row").length
      ).toBe(count);
    });
    const nextPageButton = getByLabelText("Go to next page");
    fireEvent.click(nextPageButton);
    await waitFor(() => {
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
    await waitFor(() => {
      expect(
        container.querySelectorAll(".DocumentSimpleTableResults .row").length
      ).toBe(1);
    });
  });

  it("should render downloadList banner if user select document from the table", async () => {
    const eSDocumentMock = createESDocumentHitResponseMock()._source;
    const { queryByText, getByText, findByLabelText } = renderWithProviders({});
    const checkbox = await findByLabelText(
      `MC: documentLibrary.download ${eSDocumentMock.title}`
    );
    expect(queryByText("MC: downloadList.info.title")).toBeFalsy();
    expect(queryByText("MC: downloadList.info.message")).toBeFalsy();

    fireEvent.click(checkbox);
    expect(getByText("MC: downloadList.info.title")).toBeTruthy();
    expect(getByText("MC: downloadList.info.message")).toBeTruthy();
  });

  it("should update count after clicking any document checkbox", async () => {
    const handleDownloadClickSpy = jest.spyOn(
      documentResultsFooter,
      "handleDownloadClick"
    );
    const mockESDocumentsList = Array.from(Array(2)).map((_, index) =>
      createESDocumentHitResponseMock({
        title: `documentTitle${index}`,
        titleAndSize: `AeroDek_${index}`
      })
    );
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [...mockESDocumentsList],
        total: {
          value: 1
        }
      }
    });
    const { findByLabelText, findByText } = renderWithProviders({});
    const checkbox = await findByLabelText(
      "MC: documentLibrary.download documentTitle0"
    );
    const checkbox2 = await findByLabelText(
      "MC: documentLibrary.download documentTitle1"
    );

    fireEvent.click(checkbox);
    fireEvent.click(checkbox2);
    const downloadButton = await findByText("MC: downloadList.download (2)");
    fireEvent.click(downloadButton);
    await waitFor(() => {
      expect(executeRecaptchaSpy).toHaveBeenCalledTimes(1);
      expect(handleDownloadClickSpy).toHaveBeenCalledTimes(1);
    });
  });

  it("should show tooltip when reach max limit", async () => {
    const mockESDocumentsList = Array.from(Array(2)).map((_, index) =>
      createESDocumentHitResponseMock({
        title: `documentTitle${index}`,
        titleAndSize: `AeroDek_${index}`,
        fileSize: 104857600
      })
    );
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [...mockESDocumentsList],
        total: {
          value: 1
        }
      }
    });
    const { container, findByLabelText } = renderWithProviders({});
    const checkbox = await findByLabelText(
      "MC: documentLibrary.download documentTitle0"
    );
    const checkbox2 = await findByLabelText(
      "MC: documentLibrary.download documentTitle1"
    );

    fireEvent.click(checkbox);
    fireEvent.mouseOver(checkbox2);
    const title = container.querySelector(
      "[title='MC: documents.download.maxReached']"
    );
    expect(title).toBeFalsy();
    fireEvent.click(checkbox2);
    fireEvent.mouseOver(checkbox2);
    expect(
      container.querySelector("[title='MC: documents.download.maxReached']")
    ).toBeTruthy();
  });

  it("should prevent document fetching in preview mode", async () => {
    jest.spyOn(window, "alert").mockImplementation();
    renderWithProviders({ mockEnvVariables: { isPreviewMode: true } });
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "You cannot search on the preview environment."
      );
    });
  });
});
