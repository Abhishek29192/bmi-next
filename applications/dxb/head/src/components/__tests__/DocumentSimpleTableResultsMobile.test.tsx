import React from "react";
import { render } from "@testing-library/react";
import { DocumentSimpleTableResultsMobile } from "../DocumentSimpleTableResultsMobile";
import createContentfulDocument from "../../__tests__/ContentfulDocumentHelper";
import { FileContentTypeEnum } from "../types/pim";
import { PIMDocumentData } from "../types/PIMDocumentBase";

describe("DocumentSimpleTableResultsMobile component", () => {
  const pimDocument: PIMDocumentData = {
    __typename: "PIMDocument",
    fileSize: 234,
    extension: "jpg",
    format: "image/jpg",
    id: "dummy-id",
    url: "https://doesnt-exist.com",
    title: "dummy-title",
    realFileName: null,
    product: {
      name: "dummy-product",
      code: "dummy-code"
    },
    assetType: {
      __typename: "ContentfulAssetType",
      id: "some-asset-id",
      name: "Technical Approvals",
      code: "TALS",
      description: null,
      pimCode: "TECHNICAL_APPROVALS"
    }
  };
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
  it("renders pim documents correctly", () => {
    const { container, findByText } = render(
      <DocumentSimpleTableResultsMobile
        documents={[pimDocument]}
        documentsByAssetType={[
          [
            pimDocument.assetType.code,
            [
              pimDocument,
              {
                ...pimDocument,
                __typename: "PIMLinkDocument",
                title: "link-title"
              }
            ]
          ]
        ]}
      />
    );

    expect(container).toMatchSnapshot();
    expect(findByText("dummy-title")).not.toBeNull();
    expect(container.innerHTML).toContain('<svg class="download-icon"></svg>');
  });
  it("renders multiple documents of same asset type as zip file", () => {
    const { container, queryAllByText } = render(
      <DocumentSimpleTableResultsMobile
        documents={[pimDocument]}
        documentsByAssetType={[
          [
            pimDocument.assetType.code,
            [
              pimDocument,
              { ...pimDocument, fileSize: 123 },
              {
                ...pimDocument,
                __typename: "PIMLinkDocument",
                title: "link-title"
              },
              {
                ...pimDocument,
                title: "zip-tile",
                extension: "zip",
                format: "application/zip"
              }
            ]
          ]
        ]}
      />
    );

    expect(container).toMatchSnapshot();
    expect(queryAllByText("dummy-title").length).toBe(1);
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

    try {
      render(<DocumentSimpleTableResultsMobile documents={[document]} />);
    } catch (iconError) {
      expect(iconError).not.toBe(null);
    }
  });
});
