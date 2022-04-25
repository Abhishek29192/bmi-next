import { filterTwoOneAttributes, TwoOneClassToIgnore } from "../types";
import createClassification, {
  createFeature,
  createTwoOneClassification
} from "../ClassificationHelper";

describe("filterTwoOneAttributes tests", () => {
  describe("when Classification is NOT a Two One classification", () => {
    it("does not remove any feature attributes", () => {
      const generalClassification = createClassification();
      expect((generalClassification.features || []).length).toEqual(1);
      const resultFeatures = filterTwoOneAttributes(
        "",
        generalClassification.code,
        generalClassification.features || []
      );
      expect(resultFeatures.length).toEqual(1);
    });
  });
  describe("when Classification is Two One classification", () => {
    describe("and PIM catalog key matches", () => {
      it("removes all Two One feature attributes", () => {
        const twoOneClassification = createTwoOneClassification(
          "bmiClassificationCatalog/1.0",
          TwoOneClassToIgnore.palletUomAttributes
        );
        expect((twoOneClassification.features || []).length).toEqual(11);
        const resultFeatures = filterTwoOneAttributes(
          "bmiClassificationCatalog/1.0",
          twoOneClassification.code,
          twoOneClassification.features || []
        );
        expect(resultFeatures.length).toEqual(0);
      });

      describe("and classification has MORE features than exclude list", () => {
        it("removes all only matching feature attributes", () => {
          const twoOneClassification = createTwoOneClassification(
            "bmiClassificationCatalog/1.0",
            TwoOneClassToIgnore.palletUomAttributes
          );
          twoOneClassification.features?.push(createFeature());

          expect((twoOneClassification.features || []).length).toEqual(12);
          const resultFeatures = filterTwoOneAttributes(
            "bmiClassificationCatalog/1.0",
            twoOneClassification.code,
            twoOneClassification.features || []
          );
          expect(resultFeatures.length).toEqual(1);
          expect(resultFeatures[0].code).toEqual("classification-feature-code");
          expect(resultFeatures[0].name).toEqual("name");
        });
      });
    });

    describe("and PIM catalog key does not match", () => {
      it("does not remove any feature attributes", () => {
        const twoOneClassification = createTwoOneClassification(
          "bmiClassificationCatalog/2.0",
          TwoOneClassToIgnore.palletUomAttributes
        );
        expect((twoOneClassification.features || []).length).toEqual(11);
        const resultFeatures = filterTwoOneAttributes(
          "bmiClassificationCatalog/1.0",
          twoOneClassification.code,
          twoOneClassification.features || []
        );
        expect(resultFeatures.length).toEqual(11);
        expect((twoOneClassification.features || []).length).toEqual(
          resultFeatures.length
        );
      });
    });
  });
});
