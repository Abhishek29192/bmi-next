import React from "react";
import { render } from "@testing-library/react";
import DocumentCardsResults, { getCount } from "../DocumentCardsResults";
import createContentfulDocument from "../../__tests__/ContentfulDocumentHelper";
import { Data as DocumentData } from "./../Document";

describe("Brands component", () => {
  it("renders correctly", () => {
    const docs: DocumentData[] = [createContentfulDocument()];

    const { container } = render(
      <DocumentCardsResults documents={docs} page={1} documentsPerPage={10} />
    );
    expect(container.firstChild).toMatchSnapshot();

    const resultsCount = getCount(docs);
    expect(resultsCount).toEqual(1);
  });
});
