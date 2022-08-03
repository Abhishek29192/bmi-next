import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import tiers from "../../variables/tiers/20210222125604";

export const description = "Update Audience Tiers";

export const up: MigrationFunction = (migration: Migration) => {
  const carouselItem = migration.editContentType("carouselItem");

  carouselItem.editField("audienceTiers").items({
    type: "Symbol",
    validations: [{ in: ["T1", "T2", "T3", "T4", "T5", "T6", "T7"] }]
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const carouselItem = migration.editContentType("carouselItem");

  carouselItem.editField("audienceTiers").items({
    type: "Symbol",
    validations: [{ in: tiers }]
  });
};
