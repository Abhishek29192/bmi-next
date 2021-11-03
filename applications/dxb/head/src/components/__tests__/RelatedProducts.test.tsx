import React from "react";
import { render } from "@testing-library/react";
import RelatedProducts from "../RelatedProducts";
import { Product } from "../types/pim";
import { createBaseProduct } from "../../__tests__/PimDocumentProductHelper";
import createCategory from "../../__tests__/CategoryHelper";

describe("RelatedProducts component", () => {
  it("renders correctly with no products", () => {
    const prods: Product[] = [];

    const { container } = render(
      <RelatedProducts
        countryCode="en"
        classificationNamespace={"pimClassificationNamespace"}
        products={prods}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with no variants", () => {
    const prods: Product[] = [
      createBaseProduct({
        categories: [
          createCategory({
            categoryType: "Category",
            code: "parent-category",
            parentCategoryCode: ""
          }),
          createCategory({
            categoryType: "Category",
            parentCategoryCode: "parent-category"
          })
        ],
        variantOptions: []
      })
    ];

    const { container } = render(
      <RelatedProducts
        countryCode="en"
        classificationNamespace={"bmiClassificationCatalog/1.0"}
        products={prods}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with products", () => {
    const prods: Product[] = [
      createBaseProduct({
        categories: [createCategory({ categoryType: "Category" })]
      })
    ];

    const { container } = render(
      <RelatedProducts
        countryCode="en"
        classificationNamespace={"bmiClassificationCatalog/1.0"}
        products={prods}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with products without categories", () => {
    const prods: Product[] = [createBaseProduct({ categories: [] })];

    const { container } = render(
      <RelatedProducts
        countryCode="en"
        classificationNamespace={"bmiClassificationCatalog/1.0"}
        products={prods}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  // TODO: What on earth is going on here?!
  it("renders variants correctly with products without classifications or externalProductCode", () => {
    const prods: Product[] = [
      createBaseProduct({
        categories: [
          createCategory({
            categoryType: "Category",
            code: "parent-category",
            parentCategoryCode: ""
          }),
          createCategory({
            categoryType: "Category",
            parentCategoryCode: "parent-category"
          })
        ],
        classifications: null,
        externalProductCode: "test1"
      }),
      createBaseProduct({
        categories: [
          createCategory({
            categoryType: "Category",
            code: "parent-category",
            parentCategoryCode: ""
          }),
          createCategory({
            categoryType: "Category",
            parentCategoryCode: "parent-category"
          })
        ],
        classifications: [],
        externalProductCode: "test2"
      })
    ];

    const { container } = render(
      <RelatedProducts
        countryCode="en"
        classificationNamespace={"bmiClassificationCatalog/1.0"}
        products={prods}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with scoringweight", () => {
    const prods: Product[] = [
      createBaseProduct({
        name: "product-1",
        categories: [
          createCategory({
            categoryType: "Category",
            code: "parent-category",
            parentCategoryCode: ""
          }),
          createCategory({
            categoryType: "Category",
            parentCategoryCode: "parent-category"
          })
        ],
        classifications: [
          {
            code: "scoringWeightAttributes",
            features: [
              {
                code: "bmiClassificationCatalog/1.0/scoringWeightAttributes.scoringweight",
                featureValues: [
                  {
                    value: "1",
                    code: "scoringWeightAttributes"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "test"
          }
        ]
      }),
      createBaseProduct({
        name: "product-2",
        categories: [
          createCategory({
            categoryType: "Category",
            code: "parent-category",
            parentCategoryCode: ""
          }),
          createCategory({
            categoryType: "Category",
            parentCategoryCode: "parent-category"
          })
        ],
        classifications: [
          {
            code: "scoringWeightAttributes",
            features: [
              {
                code: "bmiClassificationCatalog/1.0/scoringWeightAttributes.scoringweight",
                featureValues: [
                  {
                    value: "4",
                    code: "scoringWeightAttributes"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "test"
          }
        ]
      })
    ];

    const { container } = render(
      <RelatedProducts
        countryCode="en"
        classificationNamespace={"bmiClassificationCatalog/1.0"}
        products={prods}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  // TODO: improve test to check order correctly
  it("renders correctly when scoringweight equal", () => {
    const prods: Product[] = [
      createBaseProduct({
        name: "product-1",
        categories: [
          createCategory({
            categoryType: "Category",
            code: "parent-category",
            parentCategoryCode: ""
          }),
          createCategory({
            categoryType: "Category",
            parentCategoryCode: "parent-category"
          })
        ],
        classifications: [
          {
            code: "scoringWeightAttributes",
            features: [
              {
                code: "bmiClassificationCatalog/1.0/scoringWeightAttributes.scoringweight",
                featureValues: [
                  {
                    value: "1",
                    code: "scoringWeightAttributes"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "test"
          }
        ]
      }),
      createBaseProduct({
        name: "product-2",
        categories: [
          createCategory({
            categoryType: "Category",
            code: "parent-category",
            parentCategoryCode: ""
          }),
          createCategory({
            categoryType: "Category",
            parentCategoryCode: "parent-category"
          })
        ],
        classifications: [
          {
            code: "scoringWeightAttributes",
            features: [
              {
                code: "bmiClassificationCatalog/1.0/scoringWeightAttributes.scoringweight",
                featureValues: [
                  {
                    value: "1",
                    code: "scoringWeightAttributes"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "test"
          }
        ]
      })
    ];

    const { container } = render(
      <RelatedProducts
        countryCode="en"
        classificationNamespace={"bmiClassificationCatalog/1.0"}
        products={prods}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  // TODO: improve test to check order correctly
  it("renders correctly when scoringweight equal & names equal", () => {
    const prods: Product[] = [
      createBaseProduct({
        name: "product",
        categories: [
          createCategory({
            categoryType: "Category",
            code: "parent-category",
            parentCategoryCode: ""
          }),
          createCategory({
            categoryType: "Category",
            parentCategoryCode: "parent-category"
          })
        ],
        classifications: [
          {
            code: "scoringWeightAttributes",
            features: [
              {
                code: "bmiClassificationCatalog/1.0/scoringWeightAttributes.scoringweight",
                featureValues: [
                  {
                    value: "1",
                    code: "scoringWeightAttributes"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "test"
          }
        ]
      }),
      createBaseProduct({
        name: "product",
        categories: [
          createCategory({
            categoryType: "Category",
            code: "parent-category",
            parentCategoryCode: ""
          }),
          createCategory({
            categoryType: "Category",
            parentCategoryCode: "parent-category"
          })
        ],
        classifications: [
          {
            code: "scoringWeightAttributes",
            features: [
              {
                code: "bmiClassificationCatalog/1.0/scoringWeightAttributes.scoringweight",
                featureValues: [
                  {
                    value: "1",
                    code: "scoringWeightAttributes"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "test"
          }
        ]
      })
    ];

    const { container } = render(
      <RelatedProducts
        countryCode="en"
        classificationNamespace={"bmiClassificationCatalog/1.0"}
        products={prods}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  // TODO: improve test to check order correctly
  it("renders correctly when scoringweight equal & names sorted opposite", () => {
    const prods: Product[] = [
      createBaseProduct({
        name: "product-2",
        categories: [
          createCategory({
            categoryType: "Category",
            code: "parent-category",
            parentCategoryCode: ""
          }),
          createCategory({
            categoryType: "Category",
            parentCategoryCode: "parent-category"
          })
        ],
        classifications: [
          {
            code: "scoringWeightAttributes",
            features: [
              {
                code: "bmiClassificationCatalog/1.0/scoringWeightAttributes.scoringweight",
                featureValues: [
                  {
                    value: "1",
                    code: "scoringWeightAttributes"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "test"
          }
        ]
      }),
      createBaseProduct({
        name: "product-1",
        categories: [
          createCategory({
            categoryType: "Category",
            code: "parent-category",
            parentCategoryCode: ""
          }),
          createCategory({
            categoryType: "Category",
            parentCategoryCode: "parent-category"
          })
        ],
        classifications: [
          {
            code: "scoringWeightAttributes",
            features: [
              {
                code: "bmiClassificationCatalog/1.0/scoringWeightAttributes.scoringweight",
                featureValues: [
                  {
                    value: "1",
                    code: "scoringWeightAttributes"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "test"
          }
        ]
      })
    ];

    const { container } = render(
      <RelatedProducts
        countryCode="en"
        classificationNamespace={"bmiClassificationCatalog/1.0"}
        products={prods}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
