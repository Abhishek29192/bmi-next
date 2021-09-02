import React from "react";
import { render } from "@testing-library/react";
import Component from "../documentsLeadBlock";
import { DocumentData } from "../types";
import "@testing-library/jest-dom";

const documents: DocumentData[] = [
  {
    __typename: "SDPDocument",
    id: "0",
    allowedToDownload: true,
    assetTypeDisplayName: "CAD Display Name",
    assetType: "CAD",
    fileSize: 270539,
    mime: "application/pdf",
    name: "1344416763",
    realFileName: "1344416763.pdf",
    url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h92/h36/9012208173086/1344416763pdf"
  }
];

describe("DocumentsLeadBlock tests", () => {
  it("should render correctly", () => {
    const { container, queryByText } = render(
      <Component documents={documents} />
    );
    const tableRows = container.querySelectorAll(".tableContainer tbody tr");

    expect(container).toMatchSnapshot();
    expect(queryByText(documents[0].assetTypeDisplayName)).toBeTruthy();
    expect(tableRows.length).toBe(1);
  });
});
