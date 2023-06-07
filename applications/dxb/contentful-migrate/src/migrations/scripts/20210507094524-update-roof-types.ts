import existingRoofers from "../../variables/roofer/20210507093532.js";
import newRoofers from "../../variables/roofer/20210507094158.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Update list of roofer types";

export const up: MigrationFunction = (migration) => {
  const roofer = migration.editContentType("roofer");

  roofer.editField("type").items({
    type: "Symbol",
    validations: [{ in: newRoofers }]
  });
};

export const down: MigrationFunction = (migration) => {
  const roofer = migration.editContentType("roofer");

  roofer.editField("type").items({
    type: "Symbol",
    validations: [{ in: existingRoofers }]
  });
};
