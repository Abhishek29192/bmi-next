const mockGetClickableActionFromUrl = jest.fn();
jest.mock("../Link", () => {
  const originalModule = jest.requireActual("../Link");

  return {
    ...originalModule,
    getClickableActionFromUrl: mockGetClickableActionFromUrl
  };
});
import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render } from "@testing-library/react";
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
    const { container, getByText, getByTestId } = render(
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
    const downloadButtons = getByTestId(
      "docment-download-section-download-button"
    );

    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(mockDescriptionText)).toBeInTheDocument();
    expect(
      getByText("MC: documentDownloadSection.documentTitle")
    ).toBeInTheDocument();
    expect(
      getByText("MC: documentDownloadSection.download")
    ).toBeInTheDocument();
    expect(getByText(document.title)).toBeInTheDocument();
    expect(downloadButtons).toBeInTheDocument();

    fireEvent.click(getByTestId("docment-download-section-download-button"));

    expect(mockGetClickableActionFromUrl).toHaveBeenCalledWith(
      null,
      null,
      null,
      `https:${document.asset.file.url}`
    );
    expect(container.querySelectorAll("table tbody svg").length).toBe(1);
  });

  it("renders correctly without data", () => {
    const { container } = render(
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

    expect(container.querySelectorAll("table").length).toBe(0);
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
    const { container, getByTestId } = render(
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
      getByTestId("docment-download-section-download-button")
    ).toBeInTheDocument();
    expect(container.querySelectorAll("table tbody svg").length).toBe(1);
  });
});
