import { ThemeProvider } from "@bmi-digital/components";
import {
  createContentfulDocument,
  createPimProductDocument
} from "@bmi/elasticsearch-types";
import { render, screen } from "@testing-library/react";
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

  describe("When SimpleTable documents have multiple unique asset type code for documents", () => {
    describe("And same no of contentful Asset Types are present with matching asset type code", () => {
      it("SimpleTable: renders correctly with ALL columns", () => {
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
              pageNumber={0}
            />
          </ThemeProvider>
        );
        expect(
          screen.getByText("MC: documentLibrary.headers.typeCode")
        ).toBeInTheDocument();
        expect(
          screen.getByText("MC: documentLibrary.headers.title")
        ).toBeInTheDocument();
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe("When SimpleTable documents have single asset type code for ALL documents", () => {
    describe("And contentful Asset Types match asset type code", () => {
      it("Does not render 'type' column", () => {
        const commonAssetType = createAssetType({ code: "CERT" });
        const contentfulDocument = createContentfulDocument({
          assetType: commonAssetType
        });
        const pimDocument = createPimProductDocument({
          assetType: commonAssetType
        });
        const assetTypes = [commonAssetType];
        render(
          <ThemeProvider>
            <DocumentResults
              data={[contentfulDocument, pimDocument]}
              format="simpleTable"
              assetTypes={assetTypes}
            />
          </ThemeProvider>
        );
        expect(
          screen.queryByText("MC: documentLibrary.headers.typeCode")
        ).not.toBeInTheDocument();
        expect(
          screen.getByText("MC: documentLibrary.headers.title")
        ).toBeInTheDocument();
      });
    });
    describe("And contentful Asset Types has one or more non matching asset type code", () => {
      it("Does not render 'type' column", () => {
        const commonAssetType = createAssetType({ code: "CERT" });
        const assetType2 = createAssetType({ code: "TECHNICAL_DOCS" });
        const assetType3 = createAssetType({ code: "MANUALS" });
        const contentfulDocument = createContentfulDocument({
          assetType: commonAssetType
        });
        const pimDocument = createPimProductDocument({
          assetType: commonAssetType
        });
        const assetTypes = [commonAssetType, assetType2, assetType3];
        render(
          <ThemeProvider>
            <DocumentResults
              data={[contentfulDocument, pimDocument]}
              format="simpleTable"
              assetTypes={assetTypes}
            />
          </ThemeProvider>
        );
        expect(
          screen.queryByText("MC: documentLibrary.headers.typeCode")
        ).not.toBeInTheDocument();
        expect(
          screen.getByText("MC: documentLibrary.headers.title")
        ).toBeInTheDocument();
      });
    });
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
    render(
      <ThemeProvider>
        <DocumentResults
          data={[contentfulDocument]}
          format="cards"
          assetTypes={assetTypes}
        />
      </ThemeProvider>
    );
    expect(screen.getByText(contentfulDocument.title)).toBeInTheDocument();
  });

  it("should render the simpleArchive table", () => {
    const pimDocument = createPimProductDocument();
    const assetTypes = [createAssetType({ code: pimDocument.assetType.code })];

    render(
      <ThemeProvider>
        <DocumentResults
          data={[pimDocument]}
          format="simpleArchiveTable"
          assetTypes={assetTypes}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByText("MC: documentLibrary.headers.productStatus")
    ).toBeInTheDocument();
    expect(
      screen.getByText("MC: documentLibrary.headers.validityDate")
    ).toBeInTheDocument();
  });
});
