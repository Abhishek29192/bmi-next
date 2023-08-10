import { Link } from "gatsby";
import createClassification, {
  createFeature
} from "../../__tests__/helpers/ClassificationHelper";
import createMeasurements from "../../__tests__/helpers/MeasurementsHelper";
import createProduct from "../../__tests__/helpers/ProductHelper";
import createRelatedVariant from "../../__tests__/helpers/RelatedVariantHelper";
import { getProductAttributes } from "../product-details-transforms";
import { Product } from "../../types/pim";

describe("product-details-transforms tests", () => {
  describe("getProductAttributes with variantCodeToPathMap tests", () => {
    const getProductAttributesWithVariantCodeToPathMap = (product: Product) =>
      getProductAttributes(
        product,
        "no",
        { size: "Size", variantAttribute: "variantattribute" },
        "",
        {
          "related-blue": "path-to-related-blue",
          "related-measure-3": "path-to-related-measure-3",
          "related-texture-family-2": "path-to-related-texture-family-2",
          "related-colour-family-2": "path-to-related-colour-family-2",
          "related-variant-attrib-2": "path-to-related-variant-attrib-1"
        }
      );

    describe("when productClassifications is NOT empty object", () => {
      describe("And self product is a Product object", () => {
        describe("And should return related variant path from variantCodeToPathMap", () => {
          it("for colour", () => {
            const selfProduct = createProduct({
              code: "product-code-1",
              colour: "red",
              relatedVariants: [
                createRelatedVariant({ colour: "red" }),
                createRelatedVariant({ code: "related-blue", colour: "blue" })
              ]
            });
            const result =
              getProductAttributesWithVariantCodeToPathMap(selfProduct);
            expect(result).toMatchInlineSnapshot(`
              [
                {
                  "name": "Colour",
                  "type": "thumbnails",
                  "variants": [
                    {
                      "action": {
                        "linkComponent": [MockFunction],
                        "model": "routerLink",
                        "to": "/no/path-to-related-blue/",
                      },
                      "isSelected": false,
                      "label": "blue",
                      "media": null,
                      "thumbnail": "http://localhost:8000/image-thumbnail.jpg",
                    },
                    {
                      "isSelected": true,
                      "label": "red",
                      "media": null,
                      "thumbnail": "http://localhost:8000/image-thumbnail.jpg",
                    },
                  ],
                },
                {
                  "name": "Texture Family",
                  "type": "chips",
                  "variants": [
                    {
                      "isSelected": true,
                      "label": "texture-family",
                    },
                  ],
                },
                {
                  "name": "Size",
                  "type": "chips",
                  "variants": [
                    {
                      "isSelected": true,
                      "label": "6x7x8symbol",
                    },
                  ],
                },
                {
                  "name": "variantattribute",
                  "type": "chips",
                  "variants": [
                    {
                      "isSelected": true,
                      "label": "variant-attribute",
                    },
                  ],
                },
              ]
            `);
          });
        });

        describe("And measurements props are populated on classifications", () => {
          describe("And product measurements is selected", () => {
            it("returns measurements prop related variant path from variantCodeToPathMap (length, height and width)", () => {
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
                    code: "related-measure-1",
                    measurements: createMeasurements({
                      height: { value: "10", unit: "mm" },
                      width: { value: "11", unit: "mm" },
                      length: { value: "12", unit: "mm" },
                      label: "12x10x11mm"
                    })
                  }),
                  createRelatedVariant({
                    code: "related-measure-2",
                    measurements: createMeasurements({
                      height: { value: "12", unit: "mm" },
                      width: { value: "11", unit: "mm" },
                      length: { value: "13", unit: "mm" },
                      label: "13x12x11mm"
                    })
                  }),
                  createRelatedVariant({
                    code: "related-measure-3",
                    measurements: createMeasurements({
                      height: { value: "3", unit: "mm" },
                      width: { value: "4", unit: "mm" },
                      length: { value: "5", unit: "mm" },
                      label: "5x3x4mm"
                    })
                  })
                ]
              });
              const result =
                getProductAttributesWithVariantCodeToPathMap(selfProduct);
              const expectedResult = [
                {
                  name: "Colour",
                  type: "thumbnails",
                  variants: []
                },
                {
                  name: "Texture Family",
                  type: "chips",
                  variants: []
                },
                {
                  name: "Size",
                  type: "chips",
                  variants: [
                    {
                      label: "label",
                      isSelected: false,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "5x3x4mm",
                      isSelected: false,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/path-to-related-measure-3/"
                      }
                    },
                    {
                      label: "6x7x8symbol",
                      isSelected: true
                    },
                    {
                      label: "12x10x11mm",
                      isSelected: false,
                      action: {
                        linkComponent: Link,
                        model: "routerLink",
                        to: "/no/p/name-hashed-related-code/"
                      }
                    },
                    {
                      label: "13x12x11mm",
                      isSelected: false,
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
                  variants: []
                }
              ];

              expect(result).toEqual(expectedResult);
            });
          });
        });
        describe("And texturefamily props are populated on classifications", () => {
          describe("And texturefamily is selected", () => {
            it("returns texturefamily prop related variant path from variantCodeToPathMap", () => {
              const selfProduct = createProduct({
                code: "product-code-1",
                classifications: [createClassification({})],
                textureFamily: "matt",
                colour: undefined,
                relatedVariants: [
                  createRelatedVariant({
                    code: "related-texture-family-1",
                    textureFamily: "matt",
                    measurements: createMeasurements()
                  }),
                  createRelatedVariant({
                    code: "related-texture-family-2",
                    textureFamily: "gloss",
                    measurements: createMeasurements()
                  })
                ]
              });
              const result =
                getProductAttributesWithVariantCodeToPathMap(selfProduct);
              expect(result).toMatchInlineSnapshot(`
                [
                  {
                    "name": "Colour",
                    "type": "thumbnails",
                    "variants": [],
                  },
                  {
                    "name": "Texture Family",
                    "type": "chips",
                    "variants": [
                      {
                        "action": {
                          "linkComponent": [MockFunction],
                          "model": "routerLink",
                          "to": "/no/path-to-related-texture-family-2/",
                        },
                        "isSelected": false,
                        "label": "gloss",
                      },
                      {
                        "isSelected": true,
                        "label": "matt",
                      },
                    ],
                  },
                  {
                    "name": "Size",
                    "type": "chips",
                    "variants": [
                      {
                        "isSelected": true,
                        "label": "6x7x8symbol",
                      },
                    ],
                  },
                  {
                    "name": "variantattribute",
                    "type": "chips",
                    "variants": [
                      {
                        "isSelected": true,
                        "label": "variant-attribute",
                      },
                    ],
                  },
                ]
              `);
            });
          });
        });

        describe("And variantattribute props are populated on classifications", () => {
          describe("And product variantattribute is selected", () => {
            it("returns variantattribute prop related variant path from variantCodeToPathMap", () => {
              const selfProduct = createProduct({
                code: "product-code-1",
                classifications: [createClassification({})],
                measurements: undefined,
                colour: undefined,
                textureFamily: undefined,
                variantAttribute: "variant-value-1",
                relatedVariants: [
                  createRelatedVariant({
                    code: "related-variant-attrib-1",
                    variantAttribute: "value-1"
                  }),
                  createRelatedVariant({
                    code: "related-variant-attrib-2",
                    variantAttribute: "value-2"
                  })
                ]
              });
              const result =
                getProductAttributesWithVariantCodeToPathMap(selfProduct);
              expect(result).toMatchInlineSnapshot(`
                [
                  {
                    "name": "Colour",
                    "type": "thumbnails",
                    "variants": [],
                  },
                  {
                    "name": "Texture Family",
                    "type": "chips",
                    "variants": [],
                  },
                  {
                    "name": "Size",
                    "type": "chips",
                    "variants": [],
                  },
                  {
                    "name": "variantattribute",
                    "type": "chips",
                    "variants": [
                      {
                        "action": {
                          "linkComponent": [MockFunction],
                          "model": "routerLink",
                          "to": "/no/p/name-hashed-related-code/",
                        },
                        "isSelected": false,
                        "label": "value-1",
                      },
                      {
                        "action": {
                          "linkComponent": [MockFunction],
                          "model": "routerLink",
                          "to": "/no/path-to-related-variant-attrib-1/",
                        },
                        "isSelected": false,
                        "label": "value-2",
                      },
                      {
                        "isSelected": true,
                        "label": "variant-value-1",
                      },
                    ],
                  },
                ]
              `);
            });
          });
        });
      });
    });
  });
});
