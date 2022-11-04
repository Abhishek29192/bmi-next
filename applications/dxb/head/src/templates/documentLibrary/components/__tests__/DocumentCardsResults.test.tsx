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
    const { container } = render(<DocumentCardsResults documents={docs} />);
    expect(container).toMatchSnapshot();
  });

  it("renders correctly for mobile", () => {
    jest.mock("@material-ui/core", () => ({
      useMediaQuery: jest.fn().mockRejectedValue(true)
    }));
    const { container } = render(<DocumentCardsResults documents={docs} />);
    expect(container).toMatchSnapshot();
  });
});
