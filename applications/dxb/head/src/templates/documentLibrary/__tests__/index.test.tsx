/* eslint-disable prefer-spread */
import { ThemeProvider } from "@bmi-digital/components";
import {
  fireEvent,
  RenderResult,
  screen,
  waitFor
} from "@testing-library/react";
import React from "react";
import {
  createContentfulDocument,
  createPimProductDocument
} from "@bmi/elasticsearch-types";
import DocumentLibraryPage, { PAGE_SIZE } from "../";
import * as documentResultsFooter from "../../../components/DocumentResultsFooter";
import { ConfigProvider, EnvConfig } from "../../../contexts/ConfigProvider";
import { renderWithRouter } from "../../../test/renderWithRouter";
import * as elasticSearch from "../../../utils/elasticSearch";
import { FILTER_KEY } from "../../../utils/filters";
import { DocumentLibraryPageContext, DocumentLibraryProps } from "../types";
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
  pageData?: DocumentLibraryProps["data"];
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
    jest.clearAllMocks();
  });

  it("renders correctly ", async () => {
    const { container } = renderWithProviders({});
    expect(container).toMatchSnapshot();
    expect(mockQueryES).toBeCalled();
  });

  it("renders description correctly", () => {
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
    const data = createData([], { description: richText });
    renderWithProviders({ pageData: data });

    expect(screen.getByText(paragraphText)).toBeTruthy();
  });

  it("should render DocumentSimpleTableResults correctly if source === PIM and resultsType === Simple", async () => {
    const collapseData = createCollapseData();
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [
          createESDocumentHitResponseMock(
            createPimProductDocument(),
            collapseData
          )
        ],
        total: {
          value: 2
        }
      }
    });
    renderWithProviders({
      pageData: createData([], { source: "PIM", resultsType: "Simple" })
    });

    await waitFor(() => expect(mockQueryES).toBeCalled());
    const simpleTable = await screen.findByTestId(
      "document-simple-table-results"
    );
    expect(simpleTable).toMatchSnapshot();
  });

  it("should render DocumentSimpleTableResults correctly if source === PIM and resultsType === Simple Archive", async () => {
    const collapseData = createCollapseData();
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [
          createESDocumentHitResponseMock(
            createPimProductDocument(),
            collapseData
          )
        ],
        total: {
          value: 2
        }
      }
    });
    renderWithProviders({
      pageData: createData([], { source: "PIM", resultsType: "Simple Archive" })
    });

    await waitFor(() => expect(mockQueryES).toBeCalled());
    const simpleTable = await screen.findByTestId(
      "document-simple-table-results"
    );
    expect(simpleTable).toMatchSnapshot();
  });

  it("should render DocumentTechnicalTableResults correctly if source === PIM and resultsType === Technical", async () => {
    const collapseData = createCollapseData();
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [
          createESDocumentHitResponseMock(
            createPimProductDocument(),
            collapseData
          )
        ],
        total: {
          value: 2
        }
      }
    });
    renderWithProviders({
      pageData: createData([], { source: "PIM", resultsType: "Technical" })
    });

    await waitFor(() => expect(mockQueryES).toBeCalled());
    const technicalTable = await screen.findByTestId("tech-results-table");
    expect(technicalTable).toMatchSnapshot();
  });

  it("should render DocumentSimpleTableResults correctly if source === PIM and resultsType === Card Collection", async () => {
    const collapseData = createCollapseData();
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [
          createESDocumentHitResponseMock(
            createPimProductDocument(),
            collapseData
          )
        ],
        total: {
          value: 2
        }
      }
    });
    renderWithProviders({
      pageData: createData([], {
        source: "PIM",
        resultsType: "Card Collection"
      })
    });

    await waitFor(() => expect(mockQueryES).toBeCalled());
    const simpleTable = await screen.findByTestId(
      "document-simple-table-results"
    );
    expect(simpleTable).toMatchSnapshot();
  });

  it("should render DocumentSimpleTableResults correctly if source === CMS and resultsType === Simple", async () => {
    const collapseData = createCollapseData();
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [
          createESDocumentHitResponseMock(
            createContentfulDocument(),
            collapseData
          )
        ],
        total: {
          value: 2
        }
      }
    });
    renderWithProviders({
      pageData: createData([], { source: "CMS", resultsType: "Simple" })
    });

    await waitFor(() => expect(mockQueryES).toBeCalled());
    const simpleTable = await screen.findByTestId(
      "document-simple-table-results"
    );
    expect(simpleTable).toMatchSnapshot();
  });

  it("should render no table if source === CMS and resultsType === Simple Archive", async () => {
    const collapseData = createCollapseData();
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [
          createESDocumentHitResponseMock(
            createContentfulDocument(),
            collapseData
          )
        ],
        total: {
          value: 2
        }
      }
    });
    renderWithProviders({
      pageData: createData([], { source: "CMS", resultsType: "Simple Archive" })
    });

    expect(mockQueryES).not.toBeCalled();
    expect(
      screen.queryByTestId("document-simple-table-results")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("tech-results-table")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("document-cards-results-grid")
    ).not.toBeInTheDocument();
  });

  it("should render DocumentSimpleTableResults correctly if source === CMS and resultsType === Technical", async () => {
    const collapseData = createCollapseData();
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [
          createESDocumentHitResponseMock(
            createContentfulDocument(),
            collapseData
          )
        ],
        total: {
          value: 2
        }
      }
    });
    renderWithProviders({
      pageData: createData([], { source: "CMS", resultsType: "Technical" })
    });

    await waitFor(() => expect(mockQueryES).toBeCalled());
    const simpleTable = await screen.findByTestId(
      "document-simple-table-results"
    );
    expect(simpleTable).toMatchSnapshot();
  });

  it("should render DocumentCardsResults correctly if source === CMS and resultsType === Card Collection", async () => {
    const collapseData = createCollapseData([createContentfulDocument()]);
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [
          createESDocumentHitResponseMock(
            createContentfulDocument(),
            collapseData
          )
        ],
        total: {
          value: 2
        }
      }
    });
    renderWithProviders({
      pageData: createData([], {
        source: "CMS",
        resultsType: "Card Collection"
      })
    });

    await waitFor(() => expect(mockQueryES).toBeCalled());
    const cardGrid = await screen.findByTestId("document-cards-results-grid");
    expect(cardGrid).toMatchSnapshot();
  });

  it("should render DocumentSimpleTableResults correctly if source === ALL and resultsType === Simple", async () => {
    const collapseData = createCollapseData();
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [
          createESDocumentHitResponseMock(
            createPimProductDocument(),
            collapseData
          )
        ],
        total: {
          value: 2
        }
      }
    });
    renderWithProviders({
      pageData: createData([], { source: "ALL", resultsType: "Simple" })
    });

    await waitFor(() => expect(mockQueryES).toBeCalled());
    const simpleTable = await screen.findByTestId(
      "document-simple-table-results"
    );
    expect(simpleTable).toMatchSnapshot();
  });

  it("should render DocumentSimpleTableResults if source === ALL and resultsType === Simple Archive", async () => {
    const collapseData = createCollapseData();
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [
          createESDocumentHitResponseMock(
            createPimProductDocument(),
            collapseData
          )
        ],
        total: {
          value: 2
        }
      }
    });
    renderWithProviders({
      pageData: createData([], { source: "ALL", resultsType: "Simple Archive" })
    });

    await waitFor(() => expect(mockQueryES).toBeCalled());
    const simpleTable = await screen.findByTestId(
      "document-simple-table-results"
    );
    expect(simpleTable).toMatchSnapshot();
  });

  it("should render DocumentSimpleTableResults correctly if source === ALL and resultsType === Technical", async () => {
    const collapseData = createCollapseData();
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [
          createESDocumentHitResponseMock(
            createPimProductDocument(),
            collapseData
          )
        ],
        total: {
          value: 2
        }
      }
    });
    renderWithProviders({
      pageData: createData([], { source: "ALL", resultsType: "Technical" })
    });

    await waitFor(() => expect(mockQueryES).toBeCalled());
    const simpleTable = await screen.findByTestId(
      "document-simple-table-results"
    );
    expect(simpleTable).toMatchSnapshot();
  });

  it("should render DocumentSimpleTableResults correctly if source === ALL and resultsType === Card Collection", async () => {
    const collapseData = createCollapseData();
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [
          createESDocumentHitResponseMock(
            createPimProductDocument(),
            collapseData
          )
        ],
        total: {
          value: 2
        }
      }
    });
    renderWithProviders({
      pageData: createData([], {
        source: "ALL",
        resultsType: "Card Collection"
      })
    });

    await waitFor(() => expect(mockQueryES).toBeCalled());
    const simpleTable = await screen.findByTestId(
      "document-simple-table-results"
    );
    expect(simpleTable).toMatchSnapshot();
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

      renderWithProviders({
        route: mockHref
      });
      expect(mockQueryES).toBeCalled();
      expect(await screen.findByLabelText(/bmi components/i)).toBeChecked();
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
      renderWithProviders({});

      fireEvent.click(screen.queryByText("BMI Components"));
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
      renderWithProviders({});
      fireEvent.click(screen.queryByText("BMI Components"));
      expect(mockQueryES).toBeCalled();
      await waitFor(() => {
        expect(window.history.replaceState).toBeCalledWith(
          null,
          null,
          `/?${FILTER_KEY}=${encodeURIComponent(mockSearchParams)}`
        );
      });

      fireEvent.click(screen.queryByText("BMI Components"));
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
      renderWithProviders({
        route: mockHref
      });
      expect(mockQueryES).toBeCalled();
      expect(await screen.findByLabelText(/bmi components/i)).toBeChecked();
      fireEvent.click(screen.getByText("MC: documentLibrary.filters.clearAll"));
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
      createESDocumentHitResponseMock(
        createPimProductDocument({
          title: `documentTitle${index}`,
          titleAndSize: `AeroDek_${index}`
        })
      )
    );
    const mockLastEsDocument = mockESDocumentsList.slice(-1);
    mockQueryES
      .mockResolvedValueOnce({
        hits: {
          hits: [...mockESDocumentsList.slice(0, 25)]
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
    const { container } = renderWithProviders({});
    await waitFor(() => {
      expect(
        // eslint-disable-next-line testing-library/no-node-access,testing-library/no-container
        container.querySelectorAll(".DocumentSimpleTableResults .row").length
      ).toBe(count);
    });
    const nextPageButton = screen.getByLabelText("Go to next page");
    fireEvent.click(nextPageButton);
    await waitFor(() => {
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
    await waitFor(() => {
      expect(
        // eslint-disable-next-line testing-library/no-node-access,testing-library/no-container
        container.querySelectorAll(".DocumentSimpleTableResults .row").length
      ).toBe(1);
    });
  });

  it("should render downloadList banner if user select document from the table", async () => {
    const eSDocumentMock = createESDocumentHitResponseMock()._source;
    renderWithProviders({});
    const checkbox = await screen.findByLabelText(
      `MC: documentLibrary.download ${eSDocumentMock.title}`
    );
    expect(screen.queryByText("MC: downloadList.info.title")).toBeFalsy();
    expect(screen.queryByText("MC: downloadList.info.message")).toBeFalsy();

    fireEvent.click(checkbox);
    expect(screen.getByText("MC: downloadList.info.title")).toBeTruthy();
    expect(screen.getByText("MC: downloadList.info.message")).toBeTruthy();
  });

  it("should update count after clicking any document checkbox", async () => {
    const handleDownloadClickSpy = jest.spyOn(
      documentResultsFooter,
      "handleDownloadClick"
    );
    const mockESDocumentsList = Array.from(Array(2)).map((_, index) =>
      createESDocumentHitResponseMock(
        createPimProductDocument({
          title: `documentTitle${index}`,
          titleAndSize: `AeroDek_${index}`
        })
      )
    );
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [...mockESDocumentsList],
        total: {
          value: 1
        }
      }
    });
    renderWithProviders({});
    const checkbox = await screen.findByLabelText(
      "MC: documentLibrary.download documentTitle0"
    );
    const checkbox2 = await screen.findByLabelText(
      "MC: documentLibrary.download documentTitle1"
    );

    fireEvent.click(checkbox);
    fireEvent.click(checkbox2);
    const downloadButton = await screen.findByText(
      "MC: downloadList.download (2)"
    );
    fireEvent.click(downloadButton);
    await waitFor(() => {
      expect(executeRecaptchaSpy).toHaveBeenCalledTimes(1);
    });
    expect(handleDownloadClickSpy).toHaveBeenCalledTimes(1);
  });

  it("should show tooltip when reach max limit", async () => {
    const mockESDocumentsList = Array.from(Array(2)).map((_, index) =>
      createESDocumentHitResponseMock(
        createPimProductDocument({
          title: `documentTitle${index}`,
          titleAndSize: `AeroDek_${index}`,
          fileSize: 104857600
        })
      )
    );
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [...mockESDocumentsList],
        total: {
          value: 1
        }
      }
    });
    renderWithProviders({});
    const checkbox = await screen.findByLabelText(
      "MC: documentLibrary.download documentTitle0"
    );
    const checkbox2 = await screen.findByLabelText(
      "MC: documentLibrary.download documentTitle1"
    );

    fireEvent.click(checkbox);
    fireEvent.mouseOver(checkbox2);
    expect(screen.queryByText("MC: documents.download.maxReached")).toBeFalsy();
    fireEvent.click(checkbox2);
    console.log("Hovering over checkbox");
    fireEvent.mouseOver(checkbox2);
    expect(
      await screen.findByText("MC: documents.download.maxReached")
    ).toBeInTheDocument();
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

  it("should not fetch documents and show Simple Archive table if source===CMS", async () => {
    renderWithProviders({
      pageData: createData(filtersMock(), {
        resultsType: "Simple Archive",
        title: "Document library page",
        source: "CMS"
      })
    });

    expect(
      screen.queryByText("MC: documentLibrary.filters.title")
    ).not.toBeInTheDocument();
    expect(mockQueryES).not.toHaveBeenCalled();
  });
});
