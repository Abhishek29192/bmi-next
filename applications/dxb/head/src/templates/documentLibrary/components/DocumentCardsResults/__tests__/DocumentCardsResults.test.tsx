import ThemeProvider from "@bmi-digital/components/theme-provider";
import {
  ContentfulDocument,
  createContentfulDocument,
  createFullyPopulatedContentfulDocument
} from "@bmi/elasticsearch-types";
import { render, screen } from "@testing-library/react";
import React from "react";
import DocumentCardsResults from "../DocumentCardsResults";

describe("Brands component", () => {
  const docs: ContentfulDocument[] = [
    createFullyPopulatedContentfulDocument(),
    createContentfulDocument()
  ];

  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <DocumentCardsResults documents={docs} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly for mobile", () => {
    jest.mock("@mui/material/useMediaQuery", () => ({
      default: jest.fn().mockRejectedValue(true)
    }));
    const { container } = render(
      <ThemeProvider>
        <DocumentCardsResults documents={docs} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  docs.forEach(({ asset, title }, index) => {
    it("should display a copy-to-clipbard button", () => {
      render(
        <ThemeProvider>
          <DocumentCardsResults documents={docs} />
        </ThemeProvider>
      );

      const copyToClipboardButtons = screen.getAllByRole("button", {
        name: `Copy ${title}`
      });

      expect(copyToClipboardButtons[index as number]).toBeInTheDocument();
    });

    it("should display a download link", () => {
      render(
        <ThemeProvider>
          <DocumentCardsResults documents={docs} />
        </ThemeProvider>
      );

      const downloadButtons = screen.getAllByRole("link", {
        name: `Download ${title}`
      });

      expect(downloadButtons[index as number]).toHaveAttribute(
        "href",
        asset.file.url
      );
    });
  });
});
