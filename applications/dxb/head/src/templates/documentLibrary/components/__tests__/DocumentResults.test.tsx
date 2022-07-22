import { render } from "@testing-library/react";
import React from "react";
import createContentfulDocument from "../../../../__tests__/helpers/ContentfulDocumentHelper";
import createPimDocument from "../../../../__tests__/helpers/PimDocumentHelper";
import DocumentResults, {
  DocumentResultData,
  Format
} from "../DocumentResults";

describe("DocumentResults component", () => {
  let inputDataItems: DocumentResultData[];
  beforeEach(() => {
    inputDataItems = Array<DocumentResultData>();
    const baseUrl = "http://localhost/document/library/";

    const pimDocument = createPimDocument({
      id: `pim-doc-id-aero`,
      url: `${baseUrl}pim-doc-url-aero`
    });

    inputDataItems.push(pimDocument);

    const contentfulDocument = createContentfulDocument();

    inputDataItems.push(contentfulDocument);
  });
  it("SimpleTable: renders correctly", () => {
    const { container } = render(
      <DocumentResults data={inputDataItems} format="simpleTable" page={20} />
    );
    expect(container).toMatchSnapshot();
  });

  it("invalid: does not render correctly", () => {
    const format = "invalid" as Format;
    expect(() => {
      render(
        <DocumentResults data={inputDataItems} format={format} page={20} />
      );
    }).toThrowError();
  });

  it("technicalTable: renders correctly", () => {
    const { container } = render(
      <DocumentResults
        data={inputDataItems.filter(
          (data) => data.__typename !== "ContentfulDocument"
        )}
        format="technicalTable"
        page={20}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("cards: renders correctly", () => {
    const { container } = render(
      <DocumentResults data={inputDataItems} format="cards" page={20} />
    );
    expect(container).toMatchSnapshot();
  });
});
