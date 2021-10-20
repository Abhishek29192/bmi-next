import { generateProject } from "../../tests/factories/project";
import { generateGuarantee } from "../../tests/factories/guarantee";
import {
  solutionGuaranteeValidate,
  SolutionGuaranteeValidationError
} from "../guarantee";

describe("Solution Guarantee Validate", () => {
  it("should not valid if guarantee type not exist", () => {
    const project = generateProject();
    const validate = solutionGuaranteeValidate(project);
    expect(validate.isValid).toBeFalsy();
    expect(validate.validationError).toEqual(
      SolutionGuaranteeValidationError.NoGuaranteeType
    );
  });
  it("should not valid if guarantee status is Review", () => {
    const guarantee = generateGuarantee({
      status: "REVIEW",
      guaranteeType: {
        coverage: "SOLUTION"
      }
    });
    const project = generateProject({
      guarantees: {
        nodes: [guarantee]
      }
    });
    const validate = solutionGuaranteeValidate(project);
    expect(validate.isValid).toBeFalsy();
    expect(validate.validationError).toEqual(
      SolutionGuaranteeValidationError.InvalidStatus
    );
  });
  it("should not valid if company tier not in guarante type tier", () => {
    const guarantee = generateGuarantee({
      status: "NEW",
      guaranteeType: {
        tiersAvailable: []
      }
    });
    const project = generateProject({
      guarantees: {
        nodes: [guarantee]
      }
    });
    const validate = solutionGuaranteeValidate(project);
    expect(validate.isValid).toBeFalsy();
    expect(validate.validationError).toEqual(
      SolutionGuaranteeValidationError.InvalidTier
    );
  });
  it("should not valid if project details not completed", () => {
    const guarantee = generateGuarantee({
      guaranteeType: {
        tiersAvailable: ["T1"]
      }
    });
    const project = generateProject({
      guarantees: {
        nodes: [guarantee]
      }
    });
    const validate = solutionGuaranteeValidate(project);
    expect(validate.isValid).toBeFalsy();
    expect(validate.validationError).toEqual(
      SolutionGuaranteeValidationError.ProjectDetailIncomplete
    );
  });

  it("should not valid if building owner details not completed", () => {
    const project = generateProject({
      roofArea: 100
    });
    const validate = solutionGuaranteeValidate(project);
    expect(validate.isValid).toBeFalsy();
    expect(validate.validationError).toEqual(
      SolutionGuaranteeValidationError.BuildingOwnerIncomplete
    );
  });
  it("should not valid if no responsible installer", () => {
    const guarantee = generateGuarantee({
      guaranteeType: {
        evidenceCategoriesCollection: {
          items: []
        }
      }
    });
    const project = generateProject({
      guarantees: {
        nodes: [guarantee]
      },
      //roofArea: 100,
      buildingOwnerLastname: "buildingOwnerLastname",
      evidenceItems: {
        nodes: []
      }
    });
    const validate = solutionGuaranteeValidate(project);
    expect(validate.isValid).toBeFalsy();
    expect(validate.validationError).toEqual(
      SolutionGuaranteeValidationError.NoResponsibleInstaller
    );
  });
  it("should not valid if not certification", () => {
    const project = generateProject({
      projectMembers: {
        nodes: [
          {
            account: {
              certificationsByDoceboUserId: {
                nodes: [
                  {
                    technology: "FLAT"
                  }
                ]
              }
            },
            isResponsibleInstaller: true
          }
        ]
      }
    });
    const validate = solutionGuaranteeValidate(project);
    expect(validate.isValid).toBeFalsy();
    expect(validate.validationError).toEqual(
      SolutionGuaranteeValidationError.NoValidCertification
    );
  });
});
