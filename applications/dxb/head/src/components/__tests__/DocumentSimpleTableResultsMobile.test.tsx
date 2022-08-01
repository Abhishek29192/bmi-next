import { render } from "@testing-library/react";
import React from "react";
import createContentfulDocument from "../../__tests__/helpers/ContentfulDocumentHelper";
import createPimDocument from "../../__tests__/helpers/PimDocumentHelper";
import { DocumentSimpleTableResultsMobile } from "../DocumentSimpleTableResultsMobile";

describe("DocumentSimpleTableResultsMobile component", () => {
  const pimDocument = createPimDocument();

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

    expect(container).toMatchSnapshot();
  });

  it("renders correctly when valid asset types are used", () => {
    const document = createContentfulDocument({
      asset: {
        file: {
          url: "http://doesnot-exist.com/fileName",
          fileName: "test.onlv",
          contentType: "image/jpg",
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
      <DocumentSimpleTableResultsMobile documents={[pimDocument]} />
    );

    expect(container).toMatchSnapshot();
    expect(findByText("dummy-title")).not.toBeNull();
    expect(container.innerHTML).toContain('<svg class="download-icon"></svg>');
  });
  it("renders multiple documents of same asset type as zip file", () => {
    const { container, queryAllByText } = render(
      <DocumentSimpleTableResultsMobile documents={[pimDocument]} />
    );

    expect(container).toMatchSnapshot();
    expect(queryAllByText(pimDocument.title).length).toBe(1);
    expect(container.innerHTML).toContain('<svg class="download-icon"></svg>');
  });

  it("renders correctly when invalid asset types are used", () => {
    const document = createContentfulDocument({
      asset: {
        file: {
          url: "http://doesnot-exist.com/fileName",
          fileName: "test.onlv",
          contentType: "invalidType",
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
