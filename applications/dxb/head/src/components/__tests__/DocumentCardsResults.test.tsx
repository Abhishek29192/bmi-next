import React from "react";
import { render } from "@testing-library/react";
import DocumentCardsResults, { getCount } from "../DocumentCardsResults";
import { Data as DocumentData } from "./../Document";

describe("Brands component", () => {
  it("renders correctly", () => {
    const docs: DocumentData[] = [
      {
        __typename: "ContentfulDocument",
        id: "doc1",
        title: "document 1",
        assetType: {
          __typename: "ContentfulAssetType",
          id: "asset1",
          name: "asset1",
          code: "asset1",
          description: null,
          pimCode: null
        },
        image: null,
        asset: {
          file: {
            url: "test",
            fileName: "test",
            contentType: "pdf",
            details: {
              size: 1234
            }
          }
        },
        description: null,
        brand: "BMI"
      }
    ];

    const { container } = render(
      <DocumentCardsResults documents={docs} page={1} documentsPerPage={10} />
    );
    expect(container.firstChild).toMatchSnapshot();

    const resultsCount = getCount(docs);
    expect(resultsCount).toEqual(1);
  });
});
