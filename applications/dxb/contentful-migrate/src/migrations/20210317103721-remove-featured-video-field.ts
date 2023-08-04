import {
  down as addVideoFieldMigrationDown,
  up as addVideoFieldMigrationUp
} from "./20210316124934-add-featured-video-field.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Remove featuredVideo field.";

export const up: MigrationFunction = (migration) => {
  addVideoFieldMigrationDown(migration);
};

export const down: MigrationFunction = (migration) => {
  addVideoFieldMigrationUp(migration);
};
