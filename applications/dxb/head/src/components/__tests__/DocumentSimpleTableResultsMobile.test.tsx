import React from "react";
import { render } from "@testing-library/react";
import { DocumentSimpleTableResultsMobile } from "../DocumentSimpleTableResultsMobile";
import createContentfulDocument from "../../__tests__/ContentfulDocumentHelper";

describe("DocumentSimpleTableResultsMobile component", () => {
  it("renders correctly", () => {
    const document = createContentfulDocument({
      asset: {
        file: {
          url: "http://doesnot-exist.com/fileName",
          fileName: "test.pdf",
          contentType: "application/pdf",
          details: {
            size: 89898
          }
        }
      }
    });

    const { container } = render(
      <DocumentSimpleTableResultsMobile documents={[document]} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
