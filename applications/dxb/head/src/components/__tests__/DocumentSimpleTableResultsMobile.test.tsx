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

  it("renders correctly when valid asset types are used", () => {
    const document = createContentfulDocument({
      asset: {
        file: {
          url: "http://doesnot-exist.com/fileName",
          fileName: "test.onlv",
          contentType: "image/jpg" as FileContentTypeEnum,
          details: {
            size: 89898
          }
        }
      },
      __typename: "ContentfulDocument"
    });

    const { container } = render(
      <DocumentSimpleTableResultsMobile documents={[document]} />
    );

    expect(container).toMatchSnapshot();
    expect(container.innerHTML).toContain('<svg class="download-icon"></svg>');
  });

  it("renders correctly when invalid asset types are used", () => {
    const document = createContentfulDocument({
      asset: {
        file: {
          url: "http://doesnot-exist.com/fileName",
          fileName: "test.onlv",
          contentType: "invalidType" as FileContentTypeEnum,
          details: {
            size: 89898
          }
        }
      },
      __typename: "ContentfulDocument"
    });

    const { container } = render(
      <DocumentSimpleTableResultsMobile documents={[document]} />
    );

    expect(container).toMatchSnapshot();
    expect(container.innerHTML).toContain('<svg class="download-icon"></svg>');
  });
});
