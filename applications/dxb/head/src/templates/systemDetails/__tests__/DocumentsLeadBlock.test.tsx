import { ThemeProvider } from "@bmi-digital/components";
import { render } from "@testing-library/react";
import React from "react";
import createPimSystemDocument from "../../../__tests__/helpers/PimSystemDocumentHelper";
import Component from "../documentsLeadBlock";

const documents = [createPimSystemDocument()];

describe("DocumentsLeadBlock tests", () => {
  it("should render correctly", () => {
    const { container, queryByText } = render(
      <ThemeProvider>
        <Component documents={documents} />
      </ThemeProvider>
    );
    const tableRows = container.querySelectorAll(".tableContainer tbody tr");

    expect(container).toMatchSnapshot();
    expect(queryByText(documents[0].assetType.name)).toBeTruthy();
    expect(tableRows.length).toBe(1);
  });
});
