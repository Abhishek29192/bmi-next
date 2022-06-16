import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Update tierAvailable list";

export const up: MigrationFunction = (migration: Migration) => {
  const guaranteeType = migration.editContentType("guaranteeType");

  guaranteeType.editField("tiersAvailable").items({
    type: "Symbol",
    validations: [{ in: ["T1", "T2", "T3", "T4", "T5", "T6", "T7"] }]
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const guaranteeType = migration.editContentType("guaranteeType");

  guaranteeType
    .editField("tiersAvailable")
    .items({ type: "Symbol", validations: [{ in: ["T1", "T2", "T3", "T4"] }] });
};
