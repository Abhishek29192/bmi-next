import { ThemeProvider } from "@bmi-digital/components";
import { createPimProductDocument } from "@bmi/elasticsearch-types";
import { render, screen } from "@testing-library/react";
import React from "react";
import createAssetType from "../../../../__tests__/helpers/AssetTypeHelper";
import DocumentTechnicalTableResults from "../DocumentTechnicalTableResults";

const pimDocument = createPimProductDocument({
  isLinkDocument: false
});

describe("DocumentTechnicalTableResults component", () => {
  it("Works correctly if there are no assetTypes", () => {
    render(
      <ThemeProvider>
        <DocumentTechnicalTableResults
          documents={[pimDocument]}
          assetTypes={[]}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByText(
        "A technical table cannot being shown with no asset types."
      )
    ).toBeInTheDocument();
  });

  it("Works correctly if there are assetTypes", () => {
    const assetType = createAssetType({ code: pimDocument.assetType.code });
    render(
      <ThemeProvider>
        <DocumentTechnicalTableResults
          documents={[pimDocument]}
          assetTypes={[assetType]}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId("tech-results-accordion")).toBeInTheDocument();
  });
});
