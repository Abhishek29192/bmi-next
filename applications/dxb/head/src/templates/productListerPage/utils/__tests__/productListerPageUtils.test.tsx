import { createProduct as createESProduct } from "@bmi/elasticsearch-types";
import { createSizeLabel } from "../productListerPageUtils";

describe("productListerPageUtils", () => {
  it("returns an empty string if length field dos not exist", () => {
    const product = createESProduct({
      MEASUREMENTS$LENGTH: undefined,
      MEASUREMENTS$WIDTH: [{ name: "1000 mm", value: "1000", code: "1000mm" }]
    });

    const sizeLabel = createSizeLabel(product);
    expect(sizeLabel).toBe("");
  });

  it("returns an empty string if width field dos not exist", () => {
    const product = createESProduct({
      MEASUREMENTS$WIDTH: undefined,
      MEASUREMENTS$LENGTH: [{ name: "1000 mm", value: "1000", code: "1000mm" }]
    });

    const sizeLabel = createSizeLabel(product);
    expect(sizeLabel).toBe("");
  });

  it("returns currect label if both length and width fields have the same unit", () => {
    const product = createESProduct({
      MEASUREMENTS$LENGTH: [
        { name: "100 mm", value: "100", code: "100mm" },
        { name: "120 mm", value: "120", code: "120mm" }
      ],
      MEASUREMENTS$WIDTH: [
        { name: "300 mm", value: "300", code: "300mm" },
        { name: "320 mm", value: "320", code: "320mm" }
      ]
    });

    const sizeLabel = createSizeLabel(product);
    expect(sizeLabel).toBe("100x300mm | 120x320mm");
  });

  it("returns currect label if length and width fields have different units", () => {
    const product = createESProduct({
      MEASUREMENTS$LENGTH: [
        { name: "100 mm", value: "100", code: "100mm" },
        { name: "120 mm", value: "120", code: "120mm" }
      ],
      MEASUREMENTS$WIDTH: [
        { name: "30 cm", value: "30", code: "30cm" },
        { name: "32 cm", value: "32", code: "32cm" }
      ]
    });

    const sizeLabel = createSizeLabel(product);
    expect(sizeLabel).toBe("100mm x 30cm | 120mm x 32cm");
  });
});
