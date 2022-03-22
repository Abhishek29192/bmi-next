import React from "react";
import { render } from "@testing-library/react";
import DocumentResults, {
  Data as DocumentResultsData,
  Format
} from "../DocumentResults";
import { PIMDocumentData, PIMLinkDocumentData } from "../types/PIMDocumentBase";
import { Data as DocumentData } from "../../components/Document";
import createPimDocument from "../../__tests__/PimDocumentHelper";
import createProduct from "../../__tests__/PimDocumentProductHelper";
import createCategory from "../../__tests__/CategoryHelper";
import createPimLinkDocument from "../../__tests__/PimLinkDocumentHelper";
import createContentfulDocument from "../../__tests__/ContentfulDocumentHelper";

describe("DocumentResults component", () => {
  let inputDataItems: DocumentResultsData;
  beforeEach(() => {
    inputDataItems = Array<
      PIMDocumentData | DocumentData | PIMLinkDocumentData
    >();
    const baseUrl = "http://localhost/document/library/";

    const pimDocument = createPimDocument({
      id: `pim-doc-id-aero`,
      url: `${baseUrl}pim-doc-url-aero`,
      product: createProduct({
        categories: [
          createCategory({ categoryType: "Brand" }),
          createCategory({ categoryType: "ProductFamily" })
        ]
      })
    });

    inputDataItems.push(pimDocument);

    const pimLinkDocument = createPimLinkDocument({
      id: `pim-doc-id-ico`,
      url: `${baseUrl}pim-doc-url-ico`,
      product: createProduct({
        categories: [
          createCategory({ categoryType: "Brand" }),
          createCategory({ categoryType: "ProductFamily" })
        ]
      })
    });

    inputDataItems.push(pimLinkDocument);

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
