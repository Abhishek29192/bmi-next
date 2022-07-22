import { render } from "@testing-library/react";
import React from "react";
import { ContentfulDocument as DocumentData } from "../../../../types/Document";
import createContentfulDocument from "../../../../__tests__/helpers/ContentfulDocumentHelper";
import DocumentCardsResults, { getCount } from "../DocumentCardsResults";

describe("Brands component", () => {
  const docs: DocumentData[] = [
    createContentfulDocument(),
    {
      ...createContentfulDocument(),
      featuredMedia: null,
      description: {
        raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
        references: null
      }
    }
  ];
  it("renders correctly", () => {
    const { container } = render(
      <DocumentCardsResults documents={docs} page={1} documentsPerPage={10} />
    );
    expect(container).toMatchSnapshot();

    const resultsCount = getCount(docs);
    expect(resultsCount).toEqual(2);
  });

  it("renders correctly for mobile", () => {
    jest.mock("@material-ui/core", () => ({
      useMediaQuery: jest.fn().mockRejectedValue(true)
    }));
    const { container } = render(
      <DocumentCardsResults documents={docs} page={1} documentsPerPage={10} />
    );
    expect(container).toMatchSnapshot();
  });
});
