import type { MigrationFunction } from "contentful-migration";

export const description = "Make label field not required";

export const up: MigrationFunction = (migration) => {
  const serviceLocatorSection = migration.editContentType(
    "serviceLocatorSection"
  );
  serviceLocatorSection.editField("label").required(false);
};

export const down: MigrationFunction = (migration) => {
  const serviceLocatorSection = migration.editContentType(
    "serviceLocatorSection"
  );
  serviceLocatorSection.editField("label").required(true);
};
