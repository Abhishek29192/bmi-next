/* eslint-disable prefer-spread */
import ThemeProvider from "@bmi-digital/components/theme-provider";
import {
  createContentfulDocument,
  createPimProductDocument
} from "@bmi/elasticsearch-types";
import { BLOCKS } from "@contentful/rich-text-types";
import {
  RenderResult,
  fireEvent,
  screen,
  waitFor
} from "@testing-library/react";
import React from "react";
import DocumentLibraryPage, { PAGE_SIZE } from "../";
import * as documentResultsFooter from "../../../components/DocumentResultsFooter";
import { Config, ConfigProvider } from "../../../contexts/ConfigProvider";
import { renderWithRouter } from "../../../test/renderWithRouter";
import * as elasticSearch from "../../../utils/elasticSearch";
import { FILTER_KEY } from "../../../utils/filters";
import {
  createCollapseData,
  createData,
  createESDocumentHitResponseMock,
  filtersMock
} from "../__mocks__/index.mock";
import { DocumentLibraryPageContext, DocumentLibraryProps } from "../types";
import createRichText from "../../../__tests__/helpers/RichTextHelper";
import type { RichTextData } from "../../../components/RichText";

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
  mockEnvVariables?: Partial<Config>;
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
    isPreviewMode: false,
    isLoginEnabled: true
  } as Partial<Config>;

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
        configOverride={{ ...defaultPageEnvVars, ...mockEnvVariables }}
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
    const raw: RichTextData["json"] = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
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

    const richTextReferences = new Map();
    richTextReferences.set("3tcysaa3PGMlm42U4WnlmK", { __typename: "NonType" });
    const richText = createRichText({
      json: raw,
      references: richTextReferences
    });
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
    const technicalTable = await screen.findByTestId("tech-results-accordion");
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
    expect(
      screen.queryByTestId("tech-results-accordion")
    ).not.toBeInTheDocument();
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

    it("should clear the document selection and disable as well as reset the download button once filter is applied", async () => {
      const collapseData = createCollapseData();
      const eSDocumentMock = createESDocumentHitResponseMock()._source;

      mockQueryES.mockResolvedValue({
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

      renderWithProviders({});

      const downloadBtn = await screen.findByTestId(
        "document-table-download-button"
      );

      const documentCheckbox = await screen.findByLabelText(
        `MC: documentLibrary.download ${eSDocumentMock.title}`
      );

      const resetBtn = screen.getByTestId(
        "document-results-footer-reset-button"
      );

      fireEvent.click(documentCheckbox);

      const totalSizeText = screen.getByTestId(
        "document-results-footer-total-size-value"
      );

      const maxSizeLabel = screen.getByTestId(
        "document-results-footer-max-size-value"
      );

      const downloadListTitle = screen.getByText("MC: downloadList.info.title");

      const downloadInfoMessage = screen.getByText(
        "MC: downloadList.info.message"
      );

      expect(totalSizeText).toBeInTheDocument();
      expect(maxSizeLabel).toBeInTheDocument();

      expect(
        await screen.findByText("MC: downloadList.download (1)")
      ).toBeInTheDocument();

      expect(downloadListTitle).toBeInTheDocument();
      expect(downloadInfoMessage).toBeInTheDocument();
      expect(resetBtn).not.toBeDisabled();

      fireEvent.click(screen.queryByText("BMI Components")!);

      expect(downloadListTitle).not.toBeInTheDocument();
      expect(downloadInfoMessage).not.toBeInTheDocument();
      expect(downloadBtn).toBeDisabled();
      expect(downloadBtn).toHaveTextContent("MC: downloadList.download");
      expect(totalSizeText).not.toBeInTheDocument();
      expect(maxSizeLabel).not.toBeInTheDocument();
      expect(resetBtn).toBeDisabled();
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

      fireEvent.click(screen.queryByText("BMI Components")!);
      expect(mockQueryES).toHaveBeenCalledTimes(2);

      await waitFor(() => {
        expect(window.history.replaceState).toBeCalledWith(
          null,
          "",
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
      fireEvent.click(screen.queryByText("BMI Components")!);
      expect(mockQueryES).toBeCalled();
      await waitFor(() => {
        expect(window.history.replaceState).toBeCalledWith(
          null,
          "",
          `/?${FILTER_KEY}=${encodeURIComponent(mockSearchParams)}`
        );
      });

      fireEvent.click(screen.queryByText("BMI Components")!);
      expect(mockQueryES).toBeCalled();
      await waitFor(() => {
        expect(window.history.replaceState).toBeCalledWith(
          null,
          "",
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
        expect(window.history.replaceState).toBeCalledWith(null, "", mockUrl);
      });
    });
  });

  it("should not render the table and documents footer during the initial loading", async () => {
    renderWithProviders({});
    expect(
      screen.queryByTestId("document-simple-table-results")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("document-results-footer")
    ).not.toBeInTheDocument();

    expect(
      await screen.findByTestId("document-results-footer")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("document-simple-table-results")
    ).toBeInTheDocument();
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
    expect(
      screen.queryByText("MC: downloadList.info.title")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("MC: downloadList.info.message")
    ).not.toBeInTheDocument();

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
