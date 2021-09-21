import React from "react";
import { render } from "@testing-library/react";
import { DocumentSimpleTableResultsMobile } from "../DocumentSimpleTableResultsMobile";
import createContentfulDocument from "../../__tests__/ContentfulDocumentHelper";

describe("DocumentSimpleTableResultsMobile component", () => {
  it("renders correctly", () => {
    const document = createContentfulDocument();

    const { container } = render(
      <DocumentSimpleTableResultsMobile
        documents={[
          {
            ...document,
            asset: {
              file: {
                ...document.asset.file,
                fileName: "test.pdf",
                contentType: "application/pdf"
              }
            }
          }
        ]}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
