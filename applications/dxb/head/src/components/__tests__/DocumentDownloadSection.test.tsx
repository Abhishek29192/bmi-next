const mockGetClickableActionFromUrl = jest.fn();
jest.mock("../Link", () => {
  const originalModule = jest.requireActual("../Link");

  return {
    ...originalModule,
    getClickableActionFromUrl: mockGetClickableActionFromUrl
  };
});
import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import createContentfulDocument from "../../__tests__/helpers/ContentfulDocumentHelper";
import DocumentDownloadSection from "../DocumentDownloadSection";

const mockDescriptionText =
  "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
const mockDescription = JSON.stringify({
  nodeType: "document",
  data: {},
  content: [
    {
      nodeType: "paragraph",
      content: [
        {
          nodeType: "text",
          value: mockDescriptionText,
          marks: [],
          data: {}
        }
      ],
      data: {}
    }
  ]
});

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

const title = "Document Downloads title";

describe("DocumentDownloadSection component", () => {
  it("renders correctly with all data", () => {
    const { container } = render(
      <ThemeProvider>
        <DocumentDownloadSection
          data={{
            __typename: "ContentfulDocumentDownloadSection",
            title,
            description: {
              raw: mockDescription,
              references: []
            },
            documents: [document]
          }}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
    const downloadButtons = screen.getByTestId(
      "document-download-section-download-button"
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(mockDescriptionText)).toBeInTheDocument();
    expect(
      screen.getByText("MC: documentDownloadSection.documentTitle")
    ).toBeInTheDocument();
    expect(
      screen.getByText("MC: documentDownloadSection.download")
    ).toBeInTheDocument();
    expect(screen.getByText(document.title)).toBeInTheDocument();
    expect(downloadButtons).toBeInTheDocument();

    fireEvent.click(
      screen.getByTestId("document-download-section-download-button")
    );

    expect(mockGetClickableActionFromUrl).toHaveBeenCalledWith(
      null,
      null,
      null,
      `https:${document.asset.file.url}`
    );
    expect(
      screen.getByTestId("document-download-section-file-download-icon")
    ).toBeInTheDocument();
  });

  it("renders correctly without data", () => {
    render(
      <ThemeProvider>
        <DocumentDownloadSection
          data={{
            __typename: "ContentfulDocumentDownloadSection",
            title: null,
            description: null,
            documents: []
          }}
        />
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("document-download-section-table")
    ).not.toBeInTheDocument();
  });

  it("render FileUniversal icon for document with unknown content type", () => {
    const documentWithUnknownContentType = createContentfulDocument({
      asset: {
        file: {
          url: "http://doesnot-exist.com/fileName",
          fileName: "test.onlv",
          contentType: "test/test",
          details: {
            size: 89898
          }
        }
      },
      __typename: "ContentfulDocument"
    });
    render(
      <ThemeProvider>
        <DocumentDownloadSection
          data={{
            __typename: "ContentfulDocumentDownloadSection",
            title: null,
            description: null,
            documents: [documentWithUnknownContentType]
          }}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByTestId("document-download-section-download-button")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("document-download-section-file-download-icon")
    ).toBeInTheDocument();
  });
});
