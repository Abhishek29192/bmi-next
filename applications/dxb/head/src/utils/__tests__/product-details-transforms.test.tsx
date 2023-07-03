import { MediaGallery, ThemeProvider } from "@bmi-digital/components";
import { render, screen } from "@testing-library/react";

import React from "react";
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
      getProductAttributes(product, "no", {
        size: "Size",
        variantAttribute: "variantattribute"
      });

    it("returns correct data if colour is a primary attribute", () => {
      const product = createProduct({
        colour: "colour-1",
        relatedVariants: [
          createRelatedVariant({
            textureFamily: "texture-family-2",
            colour: "colour-2",
            measurements: createMeasurements({
              height: { unit: "mm", value: "10" },
              width: { unit: "mm", value: "40" },
              length: { unit: "mm", value: "70" },
              label: "70x40x10mm"
            }),
            variantAttribute: "variant-attribute-2"
          })
        ]
      });
      const result = getProductAttributesWithCommonParams(product);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "name": "Colour",
            "type": "thumbnails",
            "variants": [
              {
                "isSelected": true,
                "label": "colour-1",
                "media": null,
                "thumbnail": "http://localhost:8000/image-thumbnail.jpg",
              },
              {
                "action": {
                  "linkComponent": [MockFunction],
                  "model": "routerLink",
                  "to": "/no/p/name-hashed-related-code/",
                },
                "isSelected": false,
                "label": "colour-2",
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

    it("returns correct data if textureFamily is a primary attribute", () => {
      const product = createProduct({
        colour: undefined,
        textureFamily: "texture-family-1",
        relatedVariants: [
          createRelatedVariant({
            textureFamily: "texture-family-2",
            colour: "colour-2",
            measurements: createMeasurements({
              height: { unit: "mm", value: "10" },
              width: { unit: "mm", value: "40" },
              length: { unit: "mm", value: "70" },
              label: "70x40x10mm"
            }),
            variantAttribute: "variant-attribute-2"
          })
        ]
      });
      const result = getProductAttributesWithCommonParams(product);
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
                "isSelected": true,
                "label": "texture-family-1",
              },
              {
                "action": {
                  "linkComponent": [MockFunction],
                  "model": "routerLink",
                  "to": "/no/p/name-hashed-related-code/",
                },
                "isSelected": false,
                "label": "texture-family-2",
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

    it("returns correct data if measurements is a primary attribute", () => {
      const product = createProduct({
        colour: undefined,
        textureFamily: undefined,
        measurements: createMeasurements({
          height: { unit: "mm", value: "10" },
          width: { unit: "mm", value: "10" },
          length: { unit: "mm", value: "10" },
          label: "10x10x10mm"
        }),
        relatedVariants: [
          createRelatedVariant({
            measurements: createMeasurements({
              height: { unit: "mm", value: "10" },
              width: { unit: "mm", value: "40" },
              length: { unit: "mm", value: "70" },
              label: "70x40x10mm"
            }),
            textureFamily: "texture-family-2",
            colour: "colour-2",
            variantAttribute: "variant-attribute-2"
          })
        ]
      });
      const result = getProductAttributesWithCommonParams(product);
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
            "variants": [
              {
                "isSelected": true,
                "label": "10x10x10mm",
              },
              {
                "action": {
                  "linkComponent": [MockFunction],
                  "model": "routerLink",
                  "to": "/no/p/name-hashed-related-code/",
                },
                "isSelected": false,
                "label": "70x40x10mm",
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

    it("returns correct data if variantAttribute is a primary attribute", () => {
      const product = createProduct({
        colour: undefined,
        textureFamily: undefined,
        measurements: undefined,
        variantAttribute: "30x40x50",
        relatedVariants: [
          createRelatedVariant({
            variantAttribute: "20x30x40"
          })
        ]
      });
      const result = getProductAttributesWithCommonParams(product);
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
                "label": "20x30x40",
              },
              {
                "isSelected": true,
                "label": "30x40x50",
              },
            ],
          },
        ]
      `);
    });

    it("returns the same measurements label only ones", () => {
      const product = createProduct({
        measurements: createMeasurements({
          height: { unit: "mm", value: "10" },
          width: { unit: "mm", value: "10" },
          length: { unit: "mm", value: "10" },
          label: "10x10x10mm"
        }),
        colour: undefined,
        variantAttribute: undefined,
        textureFamily: undefined,
        relatedVariants: [
          createRelatedVariant({
            measurements: createMeasurements({
              height: { unit: "mm", value: "10" },
              width: { unit: "mm", value: "10" },
              length: { unit: "mm", value: "10" },
              label: "10x10x10mm"
            })
          })
        ]
      });
      const result = getProductAttributesWithCommonParams(product);
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
            "variants": [
              {
                "isSelected": true,
                "label": "10x10x10mm",
              },
            ],
          },
          {
            "name": "variantattribute",
            "type": "chips",
            "variants": [],
          },
        ]
      `);
    });

    it("returns correct data if there is no label in measurements", () => {
      const product = createProduct({
        measurements: createMeasurements({
          height: { unit: "mm", value: "10" },
          width: { unit: "mm", value: "10" },
          length: { unit: "mm", value: "10" },
          label: "10x10x10"
        }),
        relatedVariants: [
          createRelatedVariant({
            measurements: createMeasurements({
              height: { unit: "mm", value: "20" },
              width: { unit: "mm", value: "30" },
              length: { unit: "mm", value: "40" },
              label: ""
            })
          })
        ]
      });
      const result = getProductAttributesWithCommonParams(product);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "name": "Colour",
            "type": "thumbnails",
            "variants": [
              {
                "isSelected": true,
                "label": "colour",
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
                "label": "10x10x10",
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

    it("returns the chip only ones if there are two related variants with the same data", () => {
      const product = createProduct({
        colour: "colour",
        relatedVariants: [
          createRelatedVariant({
            colour: "colour-1"
          }),
          createRelatedVariant({
            colour: "colour-1"
          })
        ]
      });
      const result = getProductAttributesWithCommonParams(product);

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "name": "Colour",
            "type": "thumbnails",
            "variants": [
              {
                "isSelected": true,
                "label": "colour",
                "media": null,
                "thumbnail": "http://localhost:8000/image-thumbnail.jpg",
              },
              {
                "action": {
                  "linkComponent": [MockFunction],
                  "model": "routerLink",
                  "to": "/no/p/name-hashed-related-code/",
                },
                "isSelected": false,
                "label": "colour-1",
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

    it("returns correct data if length is undefined", () => {
      const product = createProduct({
        measurements: createMeasurements({
          height: { unit: "mm", value: "20" },
          width: { unit: "mm", value: "30" },
          length: undefined,
          label: "20x30"
        })
      });
      const result = getProductAttributesWithCommonParams(product);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "name": "Colour",
            "type": "thumbnails",
            "variants": [
              {
                "isSelected": true,
                "label": "colour",
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
                "label": "20x30",
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

    it("returns correct data if width is undefined", () => {
      const product = createProduct({
        measurements: createMeasurements({
          height: { unit: "mm", value: "10" },
          width: undefined,
          length: { unit: "mm", value: "20" },
          label: "10x20"
        })
      });
      const result = getProductAttributesWithCommonParams(product);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "name": "Colour",
            "type": "thumbnails",
            "variants": [
              {
                "isSelected": true,
                "label": "colour",
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
                "label": "10x20",
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

    it("returns correct data if height is undefined", () => {
      const product = createProduct({
        measurements: createMeasurements({
          height: undefined,
          width: { unit: "mm", value: "15" },
          length: { unit: "mm", value: "25" },
          label: "25x15"
        })
      });
      const result = getProductAttributesWithCommonParams(product);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "name": "Colour",
            "type": "thumbnails",
            "variants": [
              {
                "isSelected": true,
                "label": "colour",
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
                "label": "25x15",
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

        render(
          <ThemeProvider>
            <MediaGallery media={[...result]} />
          </ThemeProvider>
        );
        const linkResult = screen.getAllByRole("img");
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
        render(
          <ThemeProvider>
            <MediaGallery media={[...result]} />
          </ThemeProvider>
        );
        const linkResult = screen.getAllByRole("img");
        expect(linkResult).toHaveLength(3);
        expect(linkResult[0].getAttribute("src")).toEqual(imgMainSource);
        expect(linkResult[1].getAttribute("src")).toEqual(imgMainSource);
        expect(linkResult[2].getAttribute("src")).toEqual(imgMainSource2);
      });
    });
  });
});
