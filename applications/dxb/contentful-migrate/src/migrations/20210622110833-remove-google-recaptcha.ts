import {
  up as addRecaptcha,
  down as removeRecaptcha
} from "./20210208143734-add-google-recaptcha.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Remove Recaptcha configuration";

export const up: MigrationFunction = (migration) => {
  removeRecaptcha(migration);
};

export const down: MigrationFunction = (migration) => {
  addRecaptcha(migration);
};
