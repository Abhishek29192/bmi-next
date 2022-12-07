import {
  createFullyPopulatedSystem,
  createSystem,
  createSystemLayer,
  System
} from "@bmi/pim-types";
import { transformSystem } from "../systemTransformer";

jest.mock("@bmi-digital/functions-logger");

describe("transformSystem", () => {
  it("transforms a system with minimal data", () => {
    const system: System = {
      type: undefined,
      approvalStatus: "approved",
      assets: undefined,
      categories: undefined,
      classifications: undefined,
      code: "code",
      images: [],
      longDescription: "long description",
      name: "name",
      shortDescription: "short description",
      systemBenefits: undefined,
      systemLayers: undefined,
      systemReferences: undefined
    };
    const transformedSystems = transformSystem(system);
    expect(transformedSystems).toEqual([
      {
        catalog: "pim-catalog-name",
        url: "/s/name-1853176582",
        variantCode: "code"
      }
    ]);
  });

  it("transforms a fully populated system", () => {
    const system = createFullyPopulatedSystem();
    const transformedSystems = transformSystem(system);
    expect(transformedSystems).toMatchInlineSnapshot(`
      Array [
        Object {
          "catalog": "pim-catalog-name",
          "url": "/s/name-1853176582",
          "variantCode": "code",
        },
      ]
    `);
  });

  it("transforms a fully populated system with multiple layers", () => {
    const system = createFullyPopulatedSystem({
      systemLayers: [
        createSystemLayer({ code: "layer 1" }),
        createSystemLayer({ code: "layer 2" })
      ]
    });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems).toMatchInlineSnapshot(`
      Array [
        Object {
          "catalog": "pim-catalog-name",
          "url": "/s/name-1853176582",
          "variantCode": "code",
        },
      ]
    `);
  });

  it("ignores systems that have approval status check", () => {
    const system = createSystem({ approvalStatus: "check" });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems).toStrictEqual([]);
  });

  it("ignores systems that have approval status unapproved", () => {
    const system = createSystem({ approvalStatus: "unapproved" });
    const transformedSystems = transformSystem(system);
    expect(transformedSystems).toStrictEqual([]);
  });
});
