import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import existingRoofers from "../../variables/roofer/20210507093532";
import newRoofers from "../../variables/roofer/20210507094158";

export const description = "Update list of roofer types";

export const up: MigrationFunction = (migration: Migration) => {
  const roofer = migration.editContentType("roofer");

  roofer.editField("type").items({
    type: "Symbol",
    validations: [{ in: newRoofers }]
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const roofer = migration.editContentType("roofer");

  roofer.editField("type").items({
    type: "Symbol",
    validations: [{ in: existingRoofers }]
  });
};
