import React from "react";
import { render } from "@testing-library/react";
import { DocumentSimpleTableResultsMobile } from "../DocumentSimpleTableResultsMobile";
import createContentfulDocument from "../../__tests__/ContentfulDocumentHelper";
import { FileContentTypeEnum } from "../types/pim";

describe("DocumentSimpleTableResultsMobile component", () => {
  it("renders correctly", () => {
    const document = createContentfulDocument({
      asset: {
        file: {
          url: "http://doesnot-exist.com/fileName",
          fileName: "test.pdf",
          contentType: FileContentTypeEnum.APPLICATION_PDF,
          details: {
            size: 89898
          }
        }
      }
    });

    const { container } = render(
      <DocumentSimpleTableResultsMobile documents={[document]} />
    );

    expect(container).toMatchSnapshot();
  });
});
