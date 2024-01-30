import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render, screen } from "@testing-library/react";
import React from "react";
import createPimSystemDocument from "../../../__tests__/helpers/PimSystemDocumentHelper";
import Component from "../documentsLeadBlock";

const documents = [createPimSystemDocument()];

describe("DocumentsLeadBlock tests", () => {
  it("should render correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <Component documents={documents} />
      </ThemeProvider>
    );

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    const tableRows = container.querySelectorAll(
      ".SystemDetailsLeadDocumentsBlockSectionStyles-tableContainer tbody tr"
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByText(documents[0].assetType.name)).toBeTruthy();
    expect(tableRows.length).toBe(1);
  });
});
