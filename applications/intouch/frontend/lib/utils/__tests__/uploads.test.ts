import { getMappedEvidenceCategory } from "../uploads";
import { generateGuarantee } from "../../tests/factories/guarantee";

describe("uploads utility", () => {
  it("find proper category", () => {
    const guarantee = generateGuarantee({
      status: "NEW",
      guaranteeType: {
        evidenceCategoriesCollection: {
          items: [
            {
              name: "Waterproofing",
              minimumUploads: 1,
              description: null
            },
            {
              name: "Drainage",
              description: {
                json: {}
              }
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
    const guarantee = generateGuarantee({
      status: "NEW",
      guaranteeType: null
    });
    const res = getMappedEvidenceCategory(guarantee, true, "Drainage");
    expect(res).toEqual(undefined);
  });
  it("customEvidenceAvailable is false", () => {
    const guarantee = generateGuarantee();
    const res = getMappedEvidenceCategory(guarantee, false, "Drainage");
    expect(res).toEqual(null);
  });
});
