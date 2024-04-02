import ThemeProvider from "@bmi-digital/components/theme-provider";
import { createProduct } from "@bmi/elasticsearch-types";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { queryElasticSearch } from "../../../utils/elasticSearch";
import TileMaterialSelection, { getTileMaterials } from "../TileMaterial";

const queryElasticSearchMock = jest.fn();

jest.mock("../../../utils/elasticSearch", () => ({
  queryElasticSearch: (...args: Parameters<typeof queryElasticSearch>) =>
    queryElasticSearchMock(...args)
}));

describe("TileMaterial", () => {
  it("renders correctly if category contains multiple tiles", () => {
    render(
      <ThemeProvider>
        <TileMaterialSelection
          name="name"
          tilesGroupedByMaterial={{
            Clay: {
              product: createProduct(),
              count: 2
            }
          }}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByText("MC: tileMaterialSelection.categories")
    ).toBeInTheDocument();
  });

  it("renders correctly if category contains only one tile", () => {
    render(
      <ThemeProvider>
        <TileMaterialSelection
          name="name"
          tilesGroupedByMaterial={{
            Clay: {
              product: createProduct(),
              count: 1
            }
          }}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByText("MC: tileMaterialSelection.category")
    ).toBeInTheDocument();
  });

  it("renders all categories", () => {
    render(
      <ThemeProvider>
        <TileMaterialSelection
          name="name"
          tilesGroupedByMaterial={{
            Clay: {
              product: createProduct(),
              count: 1
            },
            Concrete: {
              product: createProduct(),
              count: 1
            },
            Metal: {
              product: createProduct(),
              count: 1
            }
          }}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByRole("heading", { level: 6, name: "Clay" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 6, name: "Concrete" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 6, name: "Metal" })
    ).toBeInTheDocument();
  });

  it("calls onChange function", () => {
    const onChange = jest.fn();
    render(
      <ThemeProvider>
        <TileMaterialSelection
          onChange={onChange}
          name="name"
          tilesGroupedByMaterial={{
            Clay: {
              product: createProduct(),
              count: 1
            }
          }}
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId("card-input-input"));
    expect(onChange).toHaveBeenCalledWith("Clay");
  });

  it("renders corresponding text if tile materials are not provided", () => {
    const onChange = jest.fn();
    render(
      <ThemeProvider>
        <TileMaterialSelection
          onChange={onChange}
          name="name"
          tilesGroupedByMaterial={undefined}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: "MC: tileMaterialSelection.empty"
      })
    ).toBeInTheDocument();
  });
});

describe("getTileMaterials", () => {
  const angles = [10, 20, 30];

  it("returns undefined if no tiles received", async () => {
    queryElasticSearchMock.mockResolvedValue({ hits: { hits: [] } });
    expect(await getTileMaterials(angles)).toBeUndefined();
  });

  it("returns undefined if queryElasticSearchMock throws an error", async () => {
    queryElasticSearchMock.mockRejectedValue(new Error("Expected error"));
    expect(await getTileMaterials(angles)).toBeUndefined();
  });

  it("returns products grouped by material", async () => {
    const product1 = createProduct({
      baseProduct: {
        code: "pase-product-1",
        name: "Base product 1"
      }
    });

    const product2 = createProduct({
      baseProduct: {
        code: "pase-product-2",
        name: "Base product 2"
      }
    });

    const product3 = createProduct({
      baseProduct: {
        code: "pase-product-3",
        name: "Base product 3"
      }
    });

    queryElasticSearchMock.mockResolvedValue({
      hits: {
        hits: [{ _source: product1 }, { _source: product2 }]
      },
      aggregations: {
        material: {
          buckets: [
            { key: ["clay", product1.baseProduct.code] },
            { key: ["concrete", product2.baseProduct.code] },
            { key: ["concrete", product3.baseProduct.code] }
          ]
        }
      }
    });
    expect(await getTileMaterials(angles)).toEqual({
      clay: {
        product: product1,
        count: 1
      },
      concrete: {
        product: product2,
        count: 2
      }
    });
  });
});
