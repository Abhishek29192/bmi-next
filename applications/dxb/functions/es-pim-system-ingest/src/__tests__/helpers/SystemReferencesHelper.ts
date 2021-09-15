import { SystemReference } from "../../pim";

export const createSystemReference = (reference?: Partial<SystemReference>) => {
  return {
    referenceType: "CROSSELLING",
    target: {
      code: "Test_PIM_System2",
      name: "NO System 1"
    },
    preselected: true,
    ...reference
  };
};
