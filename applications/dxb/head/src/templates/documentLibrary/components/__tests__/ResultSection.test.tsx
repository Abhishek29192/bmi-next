import { ThemeProvider } from "@bmi-digital/components";
import {
  createContentfulDocument,
  createPimProductDocument
} from "@bmi/elasticsearch-types";
import { render, screen } from "@testing-library/react";
import React from "react";
import createAssetType from "../../../../__tests__/helpers/AssetTypeHelper";
import ResultSection, { Props as ResultSectionProps } from "../ResultSection";

const executeRecaptchaSpy = jest.fn().mockResolvedValue("RECAPTCHA");
jest.mock("react-google-recaptcha-v3", () => {
  const originalModule = jest.requireActual("react-google-recaptcha-v3");
  return {
    ...originalModule,
    useGoogleReCaptcha: () => ({
      executeRecaptcha: executeRecaptchaSpy
    })
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe("ResultSection", () => {
  const handlePageChange = jest.fn();
  const pimDocument = createPimProductDocument({
    id: `pim-doc-id`,
    url: `pim-doc-url`,
    title: "documentTitle"
  });
  const assetType = createAssetType();
  const props: ResultSectionProps = {
    results: [pimDocument],
    assetTypes: [assetType],
    format: "simpleTable",
    page: 1,
    pageCount: 2,
    handlePageChange
  };

  it("render correctly", () => {
    render(
      <ThemeProvider>
        <ResultSection {...props} />
      </ThemeProvider>
    );

    expect(
      screen.getByTestId("document-simple-table-results")
    ).toBeInTheDocument();
    props.results.forEach((result) => {
      expect(
        screen.getByTestId(`document-table-row-${result.id}`)
      ).toBeInTheDocument();
    });
    expect(
      screen.getByTestId("document-results-footer-wrapper")
    ).toBeInTheDocument();
    expect(screen.getByTestId("document-results-footer")).toBeInTheDocument();
  });

  it("does not trigger handleDownloadClick if format is set to cards", async () => {
    render(
      <ThemeProvider>
        <ResultSection
          {...props}
          results={[createContentfulDocument()]}
          format={"cards"}
        />
      </ThemeProvider>
    );

    expect(
      screen.queryByText("MC: downloadList.download (0)")
    ).not.toBeInTheDocument();
  });
});
