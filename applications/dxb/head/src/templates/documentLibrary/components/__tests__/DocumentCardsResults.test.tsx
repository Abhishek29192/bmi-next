import { ThemeProvider } from "@bmi-digital/components";
import {
  ContentfulDocument,
  createContentfulDocument,
  createFullyPopulatedContentfulDocument
} from "@bmi/elasticsearch-types";
import { render } from "@testing-library/react";
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
    jest.mock("@mui/material", () => ({
      useMediaQuery: jest.fn().mockRejectedValue(true)
    }));
    const { container } = render(
      <ThemeProvider>
        <DocumentCardsResults documents={docs} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
