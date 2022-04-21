import React from "react";
import { render } from "@testing-library/react";
import Component from "../documentsLeadBlock";
import createPimSystemDocument from "../../../__tests__/helpers/PimSystemDocumentHelper";

const documents = [createPimSystemDocument()];

describe("DocumentsLeadBlock tests", () => {
  it("should render correctly", () => {
    const { container, queryByText } = render(
      <Component documents={documents} />
    );
    const tableRows = container.querySelectorAll(".tableContainer tbody tr");

    expect(container).toMatchSnapshot();
    expect(queryByText(documents[0].assetType.name)).toBeTruthy();
    expect(tableRows.length).toBe(1);
  });
});
