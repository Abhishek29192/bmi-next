import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = 'Make field "Form title" mandatory';

export const up: MigrationFunction = (migration: Migration) => {
  const form = migration.editContentType("form");
  form.editField("title").required(true);
};

export const down: MigrationFunction = (migration: Migration) => {
  const form = migration.editContentType("form");
  form.editField("title").required(false);
};
