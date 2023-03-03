import {
  down as removeRecaptcha,
  up as addRecaptcha
} from "./20210208143734-add-google-recaptcha";
import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Remove Recaptcha configuration";

export const up: MigrationFunction = (migration: Migration) => {
  removeRecaptcha(migration);
};

export const down: MigrationFunction = (migration: Migration) => {
  addRecaptcha(migration);
};
