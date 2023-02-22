import { ThemeProvider } from "@bmi-digital/components";
import {
  createContentfulDocument,
  createPimProductDocument
} from "@bmi/elasticsearch-types";
import { render } from "@testing-library/react";
import React from "react";
import createAssetType from "../../../../__tests__/helpers/AssetTypeHelper";
import DocumentResults, {
  DocumentResultData,
  Format
} from "../DocumentResults";

describe("DocumentResults component", () => {
  let inputDataItems: DocumentResultData[];
  beforeEach(() => {
    inputDataItems = Array<DocumentResultData>();
    const baseUrl = "http://localhost/document/library/";

    const pimDocument = createPimProductDocument({
      id: `pim-doc-id-aero`,
      url: `${baseUrl}pim-doc-url-aero`
    });

    inputDataItems.push(pimDocument);

    const contentfulDocument = createContentfulDocument();

    inputDataItems.push(contentfulDocument);
  });
  it("SimpleTable: renders correctly", () => {
    const contentfulDocument = createContentfulDocument();
    const pimDocument = createPimProductDocument();
    const assetTypes = [
      createAssetType({ code: contentfulDocument.assetType.code }),
      createAssetType({ code: pimDocument.assetType.code })
    ];
    const { container } = render(
      <ThemeProvider>
        <DocumentResults
          data={[contentfulDocument, pimDocument]}
          format="simpleTable"
          assetTypes={assetTypes}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("invalid: does not render correctly", () => {
    const contentfulDocument = createContentfulDocument();
    const pimDocument = createPimProductDocument();
    const assetTypes = [
      createAssetType({ code: contentfulDocument.assetType.code }),
      createAssetType({ code: pimDocument.assetType.code })
    ];
    const format = "invalid" as Format;
    expect(() => {
      render(
        <ThemeProvider>
          <DocumentResults
            data={inputDataItems}
            format={format}
            assetTypes={assetTypes}
          />
        </ThemeProvider>
      );
    }).toThrowError();
  });

  it("technicalTable: renders correctly", () => {
    const pimDocument = createPimProductDocument();
    const assetTypes = [createAssetType({ code: pimDocument.assetType.code })];
    const { container } = render(
      <ThemeProvider>
        <DocumentResults
          data={[pimDocument]}
          format="technicalTable"
          assetTypes={assetTypes}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("cards: renders correctly", () => {
    const contentfulDocument = createContentfulDocument();
    const assetTypes = [
      createAssetType({ code: contentfulDocument.assetType.code })
    ];
    const { container } = render(
      <ThemeProvider>
        <DocumentResults
          data={[contentfulDocument]}
          format="cards"
          assetTypes={assetTypes}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
