import { render } from "@testing-library/react";
import React from "react";
import ProductsGridView from "../ProductsGridView";

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
    mainImage: "http://somewhere.com/imag1.png",
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

describe("ProductsGridView component", () => {
  it("renders correctly when empty", () => {
    const products: any[] = [];
    const pageContext: any = [];
    const { container } = render(
      <ProductsGridView products={products} pageContext={pageContext} />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly when not empty", () => {
    const pageContext: any = {
      variantCodeToPathMap: { ["test1"]: "test1" }
    };
    const { container } = render(
      <ProductsGridView products={products} pageContext={pageContext} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when not empty with filters from url", () => {
    const { location } = window;

    delete window.location;
    window.location = {
      search:
        '?q=query&filters=%5B%7B"name"%3A"brand"%2C"value"%3A%5B"BMI_Components"%5D%7D%5D',
      pathname: "search"
    } as Location;

    const pageContext: any = {
      variantCodeToPathMap: { ["test1"]: "test1" }
    };
    const { container } = render(
      <ProductsGridView products={products} pageContext={pageContext} />
    );
    expect(container).toMatchSnapshot();

    window.location = location;
  });
});
