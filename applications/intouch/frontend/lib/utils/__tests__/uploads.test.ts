import { getMappedEvidenceCategory } from "../uploads";
import { guaranteeFactory } from "../../tests/factories/guarantee";

describe("uploads utility", () => {
  it("find proper category", () => {
    const guarantee = guaranteeFactory({
      status: "NEW",
      guaranteeType: {
        sys: { id: "1" },
        evidenceCategoriesCollection: {
          items: [
            {
              name: "Waterproofing",
              minimumUploads: 1,
              description: null,
              sys: { id: "1" }
            },
            {
              name: "Drainage",
              description: {
                json: {}
              },
              sys: { id: "1" }
            }
          ]
        }
      }
    });
    const res = getMappedEvidenceCategory(guarantee, true, "Drainage");

    expect(res).toMatchObject(
      guarantee.guaranteeType.evidenceCategoriesCollection.items[1]
    );
  });
  it("missing guaranteeType", () => {
    const guarantee = guaranteeFactory({
      status: "NEW",
      guaranteeType: null
    });
    const res = getMappedEvidenceCategory(guarantee, true, "Drainage");
    expect(res).toEqual(undefined);
  });
  it("customEvidenceAvailable is false", () => {
    const guarantee = guaranteeFactory();
    const res = getMappedEvidenceCategory(guarantee, false, "Drainage");
    expect(res).toEqual(null);
  });
});
