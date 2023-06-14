import { ThemeProvider } from "@bmi-digital/components";
import { createPimProductDocument } from "@bmi/elasticsearch-types";
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
  const pimDocument = createPimProductDocument({
    id: `pim-doc-id`,
    url: `pim-doc-url`,
    title: "documentTitle"
  });
  const assetType = createAssetType();
  const props: ResultSectionProps = {
    results: [pimDocument],
    assetTypes: [assetType],
    format: "simpleTable"
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
  });

  it("renders correctly if there are no documents", () => {
    render(
      <ThemeProvider>
        <ResultSection {...props} results={[]} />
      </ThemeProvider>
    );

    expect(
      screen.getByText("MC: documentLibrary.noResults")
    ).toBeInTheDocument();
  });
});
