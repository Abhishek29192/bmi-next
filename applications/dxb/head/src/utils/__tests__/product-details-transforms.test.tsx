import { MediaGallery, ThemeProvider } from "@bmi/components";
import { render } from "@testing-library/react";
import { Link } from "gatsby";
import React from "react";
import createClassification, {
  createFeature
} from "../../__tests__/helpers/ClassificationHelper";
import createMeasurements from "../../__tests__/helpers/MeasurementsHelper";
import createProduct from "../../__tests__/helpers/ProductHelper";
import createRelatedVariant from "../../__tests__/helpers/RelatedVariantHelper";
import {
  getProductAttributes,
  mapClassificationValues,
  transformImages
} from "../product-details-transforms";

describe("product-details-transforms tests", () => {
  describe("getProductAttributes tests", () => {
    const getProductAttributesWithCommonParams = (product) =>
      getProductAttributes(
        product,
        "no",
        { size: "Size", variantAttribute: "variantattribute" },
        {
          color: "unavailableMicroCopy",
          size: "unavailableMicroCopy 2",
          variantattribute: "unavailableMicroCopy 3",
          texturefamily: "unavailableMicroCopy 4"
        }
      );

    describe("when productClassifications is empty object", () => {
      it("returns minimum result", () => {
        const result = getProductAttributesWithCommonParams(createProduct());
        const expectedResult = [
          {
            name: "Colour",
            type: "thumbnails",
            unavailableMicroCopy: "unavailableMicroCopy",
            variants: [
              {
                label: "colour",
                isSelected: true,
                availability: false,
                thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                media: null
              }
            ]
          },
          {
            name: "Texture Family",
            type: "chips",
            unavailableMicroCopy: "unavailableMicroCopy 4",
            variants: [
              { label: "texture-family", isSelected: true, availability: false }
            ]
          },
          {
            name: "Size",
            type: "chips",
            unavailableMicroCopy: "unavailableMicroCopy 2",
            variants: [
              {
                label: "label",
                isSelected: false,
                availability: false,
                action: {
                  linkComponent: Link,
                  model: "routerLink",
                  to: "/no/p/name-hashed-related-code/"
                }
              },
              { label: "6x7x8symbol", isSelected: true, availability: false }
            ]
          },
          {
            name: "variantattribute",
            type: "chips",
            unavailableMicroCopy: "unavailableMicroCopy 3",
            variants: [
              {
                label: "variant-attribute",
                isSelected: true,
                availability: false
              }
            ]
          }
        ];

        expect(result).toEqual(expectedResult);
      });
    });
    describe("when productClassifications is NOT empty object", () => {
      describe("And self product is a Product object", () => {
        describe("And should return availability corretly", () => {
          it("for colour", () => {
            const selfProduct = createProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(selfProduct);
            const expectedResult = [
              {
                name: "Colour",
                type: "thumbnails",
                unavailableMicroCopy: "unavailableMicroCopy",
                variants: [
                  {
                    label: "colour",
                    isSelected: true,
                    availability: false,
                    thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                    media: null
                  }
                ]
              },
              {
                name: "Texture Family",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 4",
                variants: [
                  {
                    label: "texture-family",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 2",
                variants: [
                  {
                    label: "label",
                    isSelected: false,
                    availability: false,
                    action: {
                      linkComponent: Link,
                      model: "routerLink",
                      to: "/no/p/name-hashed-related-code/"
                    }
                  },
                  {
                    label: "6x7x8symbol",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 3",
                variants: [
                  {
                    label: "variant-attribute",
                    isSelected: true,
                    availability: false
                  }
                ]
              }
            ];
            expect(result).toEqual(expectedResult);
          });
          it("for 1 hierarchy", () => {
            const selfProduct = createProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(selfProduct);
            const expectedResult = [
              {
                name: "Colour",
                type: "thumbnails",
                unavailableMicroCopy: "unavailableMicroCopy",
                variants: [
                  {
                    label: "colour",
                    isSelected: true,
                    availability: false,
                    thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                    media: null
                  }
                ]
              },
              {
                name: "Texture Family",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 4",
                variants: [
                  {
                    label: "texture-family",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 2",
                variants: [
                  {
                    label: "label",
                    isSelected: false,
                    availability: false,
                    action: {
                      linkComponent: Link,
                      model: "routerLink",
                      to: "/no/p/name-hashed-related-code/"
                    }
                  },
                  {
                    label: "6x7x8symbol",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 3",
                variants: [
                  {
                    label: "variant-attribute",
                    isSelected: true,
                    availability: false
                  }
                ]
              }
            ];

            expect(result).toEqual(expectedResult);
          });
          it("for 2 hierarchies", () => {
            const selfProduct = createProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(selfProduct);
            const expectedResult = [
              {
                name: "Colour",
                type: "thumbnails",
                unavailableMicroCopy: "unavailableMicroCopy",
                variants: [
                  {
                    label: "colour",
                    isSelected: true,
                    availability: false,
                    thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                    media: null
                  }
                ]
              },
              {
                name: "Texture Family",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 4",
                variants: [
                  {
                    label: "texture-family",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 2",
                variants: [
                  {
                    label: "label",
                    isSelected: false,
                    availability: false,
                    action: {
                      linkComponent: Link,
                      model: "routerLink",
                      to: "/no/p/name-hashed-related-code/"
                    }
                  },
                  {
                    label: "6x7x8symbol",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 3",
                variants: [
                  {
                    label: "variant-attribute",
                    isSelected: true,
                    availability: false
                  }
                ]
              }
            ];

            expect(result).toEqual(expectedResult);
          });
          it("for 3 hierarchies", () => {
            const selfProduct = createProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(selfProduct);
            const expectedResult = [
              {
                name: "Colour",
                type: "thumbnails",
                unavailableMicroCopy: "unavailableMicroCopy",
                variants: [
                  {
                    label: "colour",
                    isSelected: true,
                    availability: false,
                    thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                    media: null
                  }
                ]
              },
              {
                name: "Texture Family",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 4",
                variants: [
                  {
                    label: "texture-family",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 2",
                variants: [
                  {
                    label: "label",
                    isSelected: false,
                    availability: false,
                    action: {
                      linkComponent: Link,
                      model: "routerLink",
                      to: "/no/p/name-hashed-related-code/"
                    }
                  },
                  {
                    label: "6x7x8symbol",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 3",
                variants: [
                  {
                    label: "variant-attribute",
                    isSelected: true,
                    availability: false
                  }
                ]
              }
            ];

            expect(result).toEqual(expectedResult);
          });
        });
        describe("And color props are populated on classifications", () => {
          describe("And color is selected", () => {
            it("returns color prop as selected in result", () => {
              const selfProduct = createProduct({ code: "product-code-1" });
              const result = getProductAttributesWithCommonParams(selfProduct);
              const expectedResult = [
                {
                  name: "Colour",
                  type: "thumbnails",
                  unavailableMicroCopy: "unavailableMicroCopy",
                  variants: [
                    {
                      label: "colour",
                      isSelected: true,
                      availability: false,
                      thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                      media: null
                    }
                  ]
                },
                {
                  name: "Texture Family",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 4",
                  variants: [
                    {
                      label: "texture-family",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 2",
                  variants: [
                    {
                      label: "label",
                      isSelected: false,
                      availability: false,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "6x7x8symbol",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 3",
                  variants: [
                    {
                      label: "variant-attribute",
                      isSelected: true,
                      availability: false
                    }
                  ]
                }
              ];
              expect(result).toEqual(expectedResult);
            });

            it("and related variant has color availability", () => {
              const selfProduct = createProduct({
                code: "product-code-1",
                relatedVariants: [createRelatedVariant({ colour: "colour" })]
              });
              const result = getProductAttributesWithCommonParams(selfProduct);
              const expectedResult = [
                {
                  name: "Colour",
                  type: "thumbnails",
                  unavailableMicroCopy: "unavailableMicroCopy",
                  variants: [
                    {
                      label: "colour",
                      isSelected: true,
                      availability: false,
                      thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                      media: null
                    }
                  ]
                },
                {
                  name: "Texture Family",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 4",
                  variants: [
                    {
                      label: "texture-family",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 2",
                  variants: [
                    {
                      label: "label",
                      isSelected: false,
                      availability: false,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "6x7x8symbol",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 3",
                  variants: [
                    {
                      label: "variant-attribute",
                      isSelected: true,
                      availability: false
                    }
                  ]
                }
              ];
              expect(result).toEqual(expectedResult);
            });

            it("and related variant has color availability with ascending value", () => {
              const selfProduct = createProduct({
                code: "product-code-1",
                relatedVariants: [createRelatedVariant({ colour: "blue" })]
              });
              const result = getProductAttributesWithCommonParams(selfProduct);
              const expectedResult = [
                {
                  name: "Colour",
                  type: "thumbnails",
                  unavailableMicroCopy: "unavailableMicroCopy",
                  variants: [
                    {
                      label: "blue",
                      isSelected: false,
                      availability: false,
                      action: {
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    { label: "colour", isSelected: true, availability: false }
                  ]
                },
                {
                  name: "Texture Family",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 4",
                  variants: [
                    {
                      label: "texture-family",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 2",
                  variants: [
                    {
                      label: "label",
                      isSelected: false,
                      availability: false,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "6x7x8symbol",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 3",
                  variants: [
                    {
                      label: "variant-attribute",
                      isSelected: true,
                      availability: false
                    }
                  ]
                }
              ];
              expect(result).toMatchObject(expectedResult);
            });
          });
          describe("And color is NOT selected", () => {
            it("returns color prop result", () => {
              const productClassifications = {
                "product-code-1": {
                  colour: {
                    name: "colour",
                    value: { value: "red", code: "code" }
                  }
                }
              };
              const result = getProductAttributesWithCommonParams(
                productClassifications
              );
              const expectedResult = [
                {
                  type: "thumbnails",
                  unavailableMicroCopy: "unavailableMicroCopy",
                  variants: []
                },
                {
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 4",
                  variants: []
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 2",
                  variants: []
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 3",
                  variants: []
                }
              ];

              expect(result).toEqual(expectedResult);
            });
          });
          it("returns sorted Product Attributes", () => {
            const selfProduct = createProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(selfProduct);
            const expectedResult = [
              {
                name: "Colour",
                type: "thumbnails",
                unavailableMicroCopy: "unavailableMicroCopy",
                variants: [
                  {
                    label: "colour",
                    isSelected: true,
                    availability: false,
                    thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                    media: null
                  }
                ]
              },
              {
                name: "Texture Family",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 4",
                variants: [
                  {
                    label: "texture-family",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 2",
                variants: [
                  {
                    label: "label",
                    isSelected: false,
                    availability: false,
                    action: {
                      linkComponent: Link,
                      model: "routerLink",
                      to: "/no/p/name-hashed-related-code/"
                    }
                  },
                  {
                    label: "6x7x8symbol",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 3",
                variants: [
                  {
                    label: "variant-attribute",
                    isSelected: true,
                    availability: false
                  }
                ]
              }
            ];

            expect(result).toEqual(expectedResult);
          });
        });
        describe("And measurements props are populated on classifications", () => {
          describe("And product measurements is selected", () => {
            it("returns measurements prop result in descending order of measurements (length, height and width)", () => {
              const selfProduct = createProduct({
                code: "product-code-1",
                classifications: [
                  createClassification({
                    name: "measurements",
                    features: [
                      createFeature({ name: "length", value: "10" }),
                      createFeature({ name: "height", value: "20" }),
                      createFeature({ name: "width", value: "30" })
                    ]
                  })
                ],
                colour: undefined,
                textureFamily: undefined,
                variantAttribute: undefined,
                measurements: createMeasurements(),
                relatedVariants: [
                  createRelatedVariant(),
                  createRelatedVariant({
                    measurements: createMeasurements({
                      height: { value: "10", unit: "mm" },
                      width: { value: "11", unit: "mm" },
                      length: { value: "12", unit: "mm" },
                      label: "12x10x11mm"
                    })
                  }),
                  createRelatedVariant({
                    measurements: createMeasurements({
                      height: { value: "12", unit: "mm" },
                      width: { value: "11", unit: "mm" },
                      length: { value: "13", unit: "mm" },
                      label: "13x12x11mm"
                    })
                  }),
                  createRelatedVariant({
                    measurements: createMeasurements({
                      height: { value: "3", unit: "mm" },
                      width: { value: "4", unit: "mm" },
                      length: { value: "5", unit: "mm" },
                      label: "5x3x4mm"
                    })
                  })
                ]
              });
              const result = getProductAttributesWithCommonParams(selfProduct);
              const expectedResult = [
                {
                  name: "Colour",
                  type: "thumbnails",
                  unavailableMicroCopy: "unavailableMicroCopy",
                  variants: []
                },
                {
                  name: "Texture Family",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 4",
                  variants: []
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 2",
                  variants: [
                    {
                      label: "label",
                      isSelected: false,
                      availability: true,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "5x3x4mm",
                      isSelected: false,
                      availability: true,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "6x7x8symbol",
                      isSelected: true,
                      availability: false
                    },
                    {
                      label: "12x10x11mm",
                      isSelected: false,
                      availability: true,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "13x12x11mm",
                      isSelected: false,
                      availability: true,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    }
                  ]
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 3",
                  variants: []
                }
              ];

              expect(result).toEqual(expectedResult);
            });
          });
          describe("And product measurements is not selected", () => {
            it("returns measurements prop result", () => {
              const selfProduct = createProduct();
              const result = getProductAttributesWithCommonParams(selfProduct);
              const expectedResult = [
                {
                  name: "Colour",
                  type: "thumbnails",
                  unavailableMicroCopy: "unavailableMicroCopy",
                  variants: [
                    {
                      label: "colour",
                      isSelected: true,
                      availability: false,
                      thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                      media: null
                    }
                  ]
                },
                {
                  name: "Texture Family",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 4",
                  variants: [
                    {
                      label: "texture-family",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 2",
                  variants: [
                    {
                      label: "label",
                      isSelected: false,
                      availability: false,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "6x7x8symbol",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 3",
                  variants: [
                    {
                      label: "variant-attribute",
                      isSelected: true,
                      availability: false
                    }
                  ]
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          it("returns sorted Product Attributes", () => {
            const selfProduct = createProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(selfProduct);
            const expectedResult = [
              {
                name: "Colour",
                type: "thumbnails",
                unavailableMicroCopy: "unavailableMicroCopy",
                variants: [
                  {
                    label: "colour",
                    isSelected: true,
                    availability: false,
                    thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                    media: null
                  }
                ]
              },
              {
                name: "Texture Family",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 4",
                variants: [
                  {
                    label: "texture-family",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 2",
                variants: [
                  {
                    label: "label",
                    isSelected: false,
                    availability: false,
                    action: {
                      linkComponent: Link,
                      model: "routerLink",
                      to: "/no/p/name-hashed-related-code/"
                    }
                  },
                  {
                    label: "6x7x8symbol",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 3",
                variants: [
                  {
                    label: "variant-attribute",
                    isSelected: true,
                    availability: false
                  }
                ]
              }
            ];

            expect(result).toEqual(expectedResult);
          });
        });
        describe("And texturefamily props are populated on classifications", () => {
          describe("And texturefamily is selected", () => {
            it("returns texturefamily prop as selected in result", () => {
              const selfProduct = createProduct({
                code: "product-code-1",
                classifications: [createClassification()]
              });
              const result = getProductAttributesWithCommonParams(selfProduct);
              const expectedResult = [
                {
                  name: "Colour",
                  type: "thumbnails",
                  unavailableMicroCopy: "unavailableMicroCopy",
                  variants: [
                    {
                      label: "colour",
                      isSelected: true,
                      availability: false,
                      thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                      media: null
                    }
                  ]
                },
                {
                  name: "Texture Family",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 4",
                  variants: [
                    {
                      label: "texture-family",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 2",
                  variants: [
                    {
                      label: "label",
                      isSelected: false,
                      availability: false,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "6x7x8symbol",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 3",
                  variants: [
                    {
                      label: "variant-attribute",
                      isSelected: true,
                      availability: false
                    }
                  ]
                }
              ];

              expect(result).toEqual(expectedResult);
            });
          });
          describe("And texturefamily is NOT selected", () => {
            it("returns texturefamily prop result", () => {
              const selfProduct = createProduct();
              const result = getProductAttributesWithCommonParams(selfProduct);
              const expectedResult = [
                {
                  name: "Colour",
                  type: "thumbnails",
                  unavailableMicroCopy: "unavailableMicroCopy",
                  variants: [
                    {
                      label: "colour",
                      isSelected: true,
                      availability: false,
                      thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                      media: null
                    }
                  ]
                },
                {
                  name: "Texture Family",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 4",
                  variants: [
                    {
                      label: "texture-family",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 2",
                  variants: [
                    {
                      label: "label",
                      isSelected: false,
                      availability: false,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "6x7x8symbol",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 3",
                  variants: [
                    {
                      label: "variant-attribute",
                      isSelected: true,
                      availability: false
                    }
                  ]
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          it("returns sorted Product Attributes", () => {
            const selfProduct = createProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(selfProduct);
            const expectedResult = [
              {
                name: "Colour",
                type: "thumbnails",
                unavailableMicroCopy: "unavailableMicroCopy",
                variants: [
                  {
                    label: "colour",
                    isSelected: true,
                    availability: false,
                    thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                    media: null
                  }
                ]
              },
              {
                name: "Texture Family",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 4",
                variants: [
                  {
                    label: "texture-family",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 2",
                variants: [
                  {
                    label: "label",
                    isSelected: false,
                    availability: false,
                    action: {
                      linkComponent: Link,
                      model: "routerLink",
                      to: "/no/p/name-hashed-related-code/"
                    }
                  },
                  {
                    label: "6x7x8symbol",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 3",
                variants: [
                  {
                    label: "variant-attribute",
                    isSelected: true,
                    availability: false
                  }
                ]
              }
            ];
            expect(result).toEqual(expectedResult);
          });
        });

        describe("And colourfamily props are populated on classifications", () => {
          describe("And colourfamily is selected", () => {
            it("returns colourfamily prop as selected in result", () => {
              const selfProduct = createProduct({
                code: "product-code-1",
                classifications: [createClassification()]
              });
              const result = getProductAttributesWithCommonParams(selfProduct);
              const expectedResult = [
                {
                  name: "Colour",
                  type: "thumbnails",
                  unavailableMicroCopy: "unavailableMicroCopy",
                  variants: [
                    {
                      label: "colour",
                      isSelected: true,
                      availability: false,
                      thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                      media: null
                    }
                  ]
                },
                {
                  name: "Texture Family",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 4",
                  variants: [
                    {
                      label: "texture-family",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 2",
                  variants: [
                    {
                      label: "label",
                      isSelected: false,
                      availability: false,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "6x7x8symbol",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 3",
                  variants: [
                    {
                      label: "variant-attribute",
                      isSelected: true,
                      availability: false
                    }
                  ]
                }
              ];

              expect(result).toEqual(expectedResult);
            });
          });
          describe("And colourfamily is NOT selected", () => {
            it("returns colourfamily prop result", () => {
              const selfProduct = createProduct();
              const result = getProductAttributesWithCommonParams(selfProduct);
              const expectedResult = [
                {
                  name: "Colour",
                  type: "thumbnails",
                  unavailableMicroCopy: "unavailableMicroCopy",
                  variants: [
                    {
                      label: "colour",
                      isSelected: true,
                      availability: false,
                      thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                      media: null
                    }
                  ]
                },
                {
                  name: "Texture Family",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 4",
                  variants: [
                    {
                      label: "texture-family",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 2",
                  variants: [
                    {
                      label: "label",
                      isSelected: false,
                      availability: false,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "6x7x8symbol",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 3",
                  variants: [
                    {
                      label: "variant-attribute",
                      isSelected: true,
                      availability: false
                    }
                  ]
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          it("returns sorted Product Attributes", () => {
            const selfProduct = createProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(selfProduct);
            const expectedResult = [
              {
                name: "Colour",
                type: "thumbnails",
                unavailableMicroCopy: "unavailableMicroCopy",
                variants: [
                  {
                    label: "colour",
                    isSelected: true,
                    availability: false,
                    thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                    media: null
                  }
                ]
              },
              {
                name: "Texture Family",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 4",
                variants: [
                  {
                    label: "texture-family",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 2",
                variants: [
                  {
                    label: "label",
                    isSelected: false,
                    availability: false,
                    action: {
                      linkComponent: Link,
                      model: "routerLink",
                      to: "/no/p/name-hashed-related-code/"
                    }
                  },
                  {
                    label: "6x7x8symbol",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 3",
                variants: [
                  {
                    label: "variant-attribute",
                    isSelected: true,
                    availability: false
                  }
                ]
              }
            ];
            expect(result).toEqual(expectedResult);
          });
        });

        describe("And variantattribute props are populated on classifications", () => {
          describe("And product variantattribute is selected", () => {
            it("returns variantattribute prop result", () => {
              const selfProduct = createProduct({ code: "product-code-1" });
              const result = getProductAttributesWithCommonParams(selfProduct);
              const expectedResult = [
                {
                  name: "Colour",
                  type: "thumbnails",
                  unavailableMicroCopy: "unavailableMicroCopy",
                  variants: [
                    {
                      label: "colour",
                      isSelected: true,
                      availability: false,
                      thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                      media: null
                    }
                  ]
                },
                {
                  name: "Texture Family",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 4",
                  variants: [
                    {
                      label: "texture-family",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 2",
                  variants: [
                    {
                      label: "label",
                      isSelected: false,
                      availability: false,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "6x7x8symbol",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 3",
                  variants: [
                    {
                      label: "variant-attribute",
                      isSelected: true,
                      availability: false
                    }
                  ]
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          describe("And product variantattribute is not selected", () => {
            it("returns variantattribute prop result", () => {
              const selfProduct = createProduct();
              const result = getProductAttributesWithCommonParams(selfProduct);
              const expectedResult = [
                {
                  name: "Colour",
                  type: "thumbnails",
                  unavailableMicroCopy: "unavailableMicroCopy",
                  variants: [
                    {
                      label: "colour",
                      isSelected: true,
                      availability: false,
                      thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                      media: null
                    }
                  ]
                },
                {
                  name: "Texture Family",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 4",
                  variants: [
                    {
                      label: "texture-family",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 2",
                  variants: [
                    {
                      label: "label",
                      isSelected: false,
                      availability: false,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "6x7x8symbol",
                      isSelected: true,
                      availability: false
                    }
                  ]
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavailableMicroCopy 3",
                  variants: [
                    {
                      label: "variant-attribute",
                      isSelected: true,
                      availability: false
                    }
                  ]
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          it("returns sorted Product Attributes", () => {
            const selfProduct = createProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(selfProduct);
            const expectedResult = [
              {
                name: "Colour",
                type: "thumbnails",
                unavailableMicroCopy: "unavailableMicroCopy",
                variants: [
                  {
                    label: "colour",
                    isSelected: true,
                    availability: false,
                    thumbnail: "http://localhost:8000/image-thumbnail.jpg",
                    media: null
                  }
                ]
              },
              {
                name: "Texture Family",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 4",
                variants: [
                  {
                    label: "texture-family",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 2",
                variants: [
                  {
                    label: "label",
                    isSelected: false,
                    availability: false,
                    action: {
                      linkComponent: Link,
                      model: "routerLink",
                      to: "/no/p/name-hashed-related-code/"
                    }
                  },
                  {
                    label: "6x7x8symbol",
                    isSelected: true,
                    availability: false
                  }
                ]
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavailableMicroCopy 3",
                variants: [
                  {
                    label: "variant-attribute",
                    isSelected: true,
                    availability: false
                  }
                ]
              }
            ];
            expect(result).toEqual(expectedResult);
          });
        });
      });
    });
  });

  describe("mapClassificationValues tests", () => {
    describe("When classifiction map is unexpected keys", () => {
      it("returns empty string", () => {
        const result = mapClassificationValues(
          createProduct({
            colour: undefined,
            textureFamily: undefined,
            measurements: undefined
          })
        );
        expect(result).toEqual("");
      });
    });
    describe("When classifiction map is exptected keys", () => {
      describe("And measurement Classification is provided", () => {
        it("returns value for measurements", () => {
          const result = mapClassificationValues(
            createProduct({
              colour: undefined,
              textureFamily: undefined,
              measurements: createMeasurements()
            })
          );
          expect(result).toEqual("6x7x8symbol");
        });
      });
      describe("And colour Classification is provided", () => {
        describe("And colour value is n/a", () => {
          it("returns n/a for colour", () => {
            const result = mapClassificationValues(
              createProduct({
                colour: "n/a",
                textureFamily: undefined,
                measurements: undefined
              })
            );
            expect(result).toEqual("n/a");
          });
        });
        describe("And colour value is object is provided", () => {
          it("returns value for colour", () => {
            const result = mapClassificationValues(
              createProduct({
                colour: "red",
                textureFamily: undefined,
                measurements: undefined
              })
            );
            expect(result).toEqual("red");
          });
        });
      });
      describe("And texturefamily Classification is provided", () => {
        describe("And texturefamily value is n/a", () => {
          it("returns n/a for texturefamily", () => {
            const result = mapClassificationValues(
              createProduct({
                colour: undefined,
                textureFamily: "n/a",
                measurements: undefined
              })
            );
            expect(result).toEqual("n/a");
          });
        });
        describe("And colour value is an object", () => {
          it("returns value for texturefamily", () => {
            const result = mapClassificationValues(
              createProduct({
                textureFamily: "smooth",
                colour: undefined,
                measurements: undefined
              })
            );
            expect(result).toEqual("smooth");
          });
        });
      });
    });
  });

  describe("transformImages tests", () => {
    describe("when empty images are provided", () => {
      it("should return empty medias", () => {
        expect(transformImages([])).toEqual([]);
      });
    });
    describe("when single image is provided", () => {
      it("should return transformed media data", () => {
        const imgMainSource = "https://mainsource.com";
        const result = transformImages([
          {
            mainSource: imgMainSource,
            thumbnail: null,
            altText: "alt text"
          }
        ]);

        const wrapper = render(
          <ThemeProvider>
            <MediaGallery media={[...result]} />
          </ThemeProvider>
        );
        const linkResult = wrapper.container.querySelectorAll("img");
        expect(linkResult).toHaveLength(1);
        expect(linkResult[0].getAttribute("src")).toEqual(imgMainSource);
        //unmount();
      });
    });
    describe("when multiple images is provided", () => {
      it("should return multiple transformed media data", () => {
        const imgMainSource = "https://mainsource.com";
        const imgMainSource2 = "https://mainsource2.com";
        const result = transformImages([
          {
            mainSource: imgMainSource,
            thumbnail: null,
            altText: "alt text"
          },
          {
            mainSource: imgMainSource2,
            thumbnail: null,
            altText: "alt text 2"
          }
        ]);
        const wrapper = render(
          <ThemeProvider>
            <MediaGallery media={[...result]} />
          </ThemeProvider>
        );
        const linkResult = wrapper.container.querySelectorAll("img");
        expect(linkResult).toHaveLength(3);
        expect(linkResult[0].getAttribute("src")).toEqual(imgMainSource);
        expect(linkResult[1].getAttribute("src")).toEqual(imgMainSource);
        expect(linkResult[2].getAttribute("src")).toEqual(imgMainSource2);
      });
    });
  });
});
