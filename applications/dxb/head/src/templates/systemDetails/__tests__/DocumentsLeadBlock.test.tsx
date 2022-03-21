import React from "react";
import { render } from "@testing-library/react";
import Component from "../documentsLeadBlock";
import { DocumentData } from "../types";
import { FileContentTypeEnum } from "../../../components/types/pim";

const documents: DocumentData[] = [
  {
    __typename: "SDPDocument",
    id: "0",
    title: "title",
    assetType: {
      name: "CAD name",
      pimCode: "CAD"
    },
    asset: {
      file: {
        fileName: "1344416763.pdf",
        url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h92/h36/9012208173086/1344416763pdf",
        contentType: FileContentTypeEnum.APPLICATION_PDF,
        details: {
          size: 270539
        }
      }
    }
  }
];

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
