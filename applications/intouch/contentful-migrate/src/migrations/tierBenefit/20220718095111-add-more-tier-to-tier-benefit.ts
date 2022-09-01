import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import tiers from "../../variables/tiers/20210222125604";

export const description = "Add more tier to Tier Benefit";

export const up: MigrationFunction = (migration: Migration) => {
  const tierBenefit = migration.editContentType("tierBenefit");

  tierBenefit.editField("tier", {
    type: "Symbol",
    validations: [
      { unique: true },
      {
        in: ["T1", "T2", "T3", "T4", "T5", "T6", "T7"],
        message: "Please select a tier"
      }
    ]
  });

  tierBenefit.changeFieldControl("tier", "builtin", "radio");
};

export const down: MigrationFunction = (migration: Migration) => {
  const tierBenefit = migration.editContentType("tierBenefit");

  tierBenefit.editField("tier", {
    type: "Symbol",
    validations: [
      { unique: true },
      {
        in: tiers,
        message: "Please select a tier"
      }
    ]
  });

  tierBenefit.changeFieldControl("tier", "builtin", "radio");
};
