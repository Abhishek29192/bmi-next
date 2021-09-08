import React from "react";
import { render } from "@testing-library/react";
import ProductsGridView from "../ProductsGridView";

describe("ProductsGridView component", () => {
  it("renders correctly when empty", () => {
    const products: any[] = [];
    const pageContext: any = [];
    const { container } = render(
      <ProductsGridView products={products} pageContext={pageContext} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly when not empty", () => {
    const products: any[] = [
      {
        code: "test1",
        externalProductCode: "test1",
        name: "imaproduct",
        description: "imadescription",
        documents: [],
        breadcrumbs: null,
        categories: [
          {
            name: "Root",
            categoryType: "Category",
            code: "Root",
            parentCategoryCode: ""
          },
          {
            name: "Bob",
            categoryType: "Category",
            code: "BOB",
            parentCategoryCode: "Root"
          }
        ],
        images: [],
        variantOptions: [
          {
            code: "test1",
            externalProductCode: "test1",
            isSampleOrderAllowed: false,
            approvalStatus: "approved",
            shortDescription: "blah",
            longDescription: "blah blah",
            images: null,
            breadcrumbs: null,
            path: ""
          }
        ],
        baseProduct: {
          code: "test1",
          externalProductCode: "test1",
          name: "imaproduct",
          description: "imadescription",
          documents: [],
          breadcrumbs: null,
          categories: [
            {
              name: "Root",
              categoryType: "Category",
              code: "Root",
              parentCategoryCode: ""
            },
            {
              name: "Bob",
              categoryType: "Category",
              code: "BOB",
              parentCategoryCode: "Root"
            }
          ],
          variantOptions: [
            {
              code: "test1",
              externalProductCode: "test1",
              isSampleOrderAllowed: false,
              approvalStatus: "approved",
              shortDescription: "blah",
              longDescription: "blah blah",
              images: null,
              breadcrumbs: null,
              path: ""
            }
          ]
        }
      }
    ];

    const pageContext: any = {
      variantCodeToPathMap: { ["test1"]: "test1" }
    };
    const { container } = render(
      <ProductsGridView products={products} pageContext={pageContext} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
