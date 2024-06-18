import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import createContentfulDocument from "../../__tests__/helpers/ContentfulDocumentHelper";
import DocumentDownloadSection from "../DocumentDownloadSection";

jest.mock("../link/utils", () => {
  const originalModule = jest.requireActual("../link/utils");
  const mockGetClickableActionFromUrl = jest.fn();
  return {
    ...originalModule,
    getClickableActionFromUrl: mockGetClickableActionFromUrl
  };
});

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
      screen.queryByTestId("document-simple-table-results")
    ).not.toBeInTheDocument();
  });

  it("moves to second page", () => {
    render(
      <ThemeProvider>
        <DocumentDownloadSection
          data={{
            __typename: "ContentfulDocumentDownloadSection",
            title,
            description: {
              raw: mockDescription,
              references: []
            },
            documents: new Array(30).fill(document)
          }}
        />
      </ThemeProvider>
    );

    let tableRows = screen.getAllByTestId(/^document-table-row-/);
    expect(tableRows.length).toBe(24);

    fireEvent.click(screen.getByLabelText("Go to page 2"));
    tableRows = screen.getAllByTestId(/^document-table-row-/);
    expect(tableRows.length).toBe(6);
  });
});
