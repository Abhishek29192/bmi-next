import React from "react";
import { render } from "@testing-library/react";
import RelatedProducts from "../RelatedProducts";
import { Product } from "../types/ProductBaseTypes";

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
        variantOptions: []
      }
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
    const prods: Product[] = [
      {
        code: "test1",
        externalProductCode: "test1",
        name: "imaproduct",
        description: "imadescription",
        documents: [],
        breadcrumbs: null,
        categories: [],
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

  it("renders variants correctly with products without classifications or externalProductCode", () => {
    const prods: Product[] = [
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
      },
      {
        code: "test2",
        externalProductCode: "test2",
        name: "imaproduct2",
        description: "imadescription2",
        documents: [],
        breadcrumbs: null,
        classifications: [],
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
            code: "test2",
            externalProductCode: "",
            isSampleOrderAllowed: false,
            approvalStatus: "approved",
            shortDescription: "blah2",
            longDescription: "blah blah2",
            images: null,
            breadcrumbs: null,
            path: ""
          }
        ]
      }
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
      {
        code: "test1",
        externalProductCode: "test1",
        name: "imaproduct",
        description: "imadescription",
        documents: [],
        breadcrumbs: null,
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
        ],
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
      },
      {
        code: "test2",
        externalProductCode: "test2",
        name: "imaproduct2",
        description: "imadescription2",
        documents: [],
        breadcrumbs: null,
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
        ],
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
            code: "test2",
            externalProductCode: "test2",
            isSampleOrderAllowed: false,
            approvalStatus: "approved",
            shortDescription: "blah2",
            longDescription: "blah blah2",
            images: null,
            breadcrumbs: null,
            path: ""
          }
        ]
      }
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
      {
        code: "test1",
        externalProductCode: "test1",
        name: "imaproduct",
        description: "imadescription",
        documents: [],
        breadcrumbs: null,
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
        ],
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
      },
      {
        code: "test2",
        externalProductCode: "test2",
        name: "imaproduct2",
        description: "imadescription2",
        documents: [],
        breadcrumbs: null,
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
        ],
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
            code: "test2",
            externalProductCode: "test2",
            isSampleOrderAllowed: false,
            approvalStatus: "approved",
            shortDescription: "blah2",
            longDescription: "blah blah2",
            images: null,
            breadcrumbs: null,
            path: ""
          }
        ]
      }
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
      {
        code: "test1",
        externalProductCode: "test1",
        name: "imaproduct",
        description: "imadescription",
        documents: [],
        breadcrumbs: null,
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
        ],
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
      },
      {
        code: "test2",
        externalProductCode: "test2",
        name: "imaproduct",
        description: "imadescription2",
        documents: [],
        breadcrumbs: null,
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
        ],
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
            code: "test2",
            externalProductCode: "test2",
            isSampleOrderAllowed: false,
            approvalStatus: "approved",
            shortDescription: "blah2",
            longDescription: "blah blah2",
            images: null,
            breadcrumbs: null,
            path: ""
          }
        ]
      }
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
      {
        code: "test1",
        externalProductCode: "test1",
        name: "imaproduct2",
        description: "imadescription",
        documents: [],
        breadcrumbs: null,
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
        ],
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
      },
      {
        code: "test2",
        externalProductCode: "test2",
        name: "imaproduct1",
        description: "imadescription2",
        documents: [],
        breadcrumbs: null,
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
        ],
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
            code: "test2",
            externalProductCode: "test2",
            isSampleOrderAllowed: false,
            approvalStatus: "approved",
            shortDescription: "blah2",
            longDescription: "blah blah2",
            images: null,
            breadcrumbs: null,
            path: ""
          }
        ]
      }
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
