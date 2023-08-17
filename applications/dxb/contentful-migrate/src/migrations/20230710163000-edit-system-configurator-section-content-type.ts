import type { MigrationFunction } from "contentful-migration";

export const description = "Edit System Configurator Section content type";

export const up: MigrationFunction = (migration) => {
  const systemConfiguratorSection = migration.editContentType(
    "systemConfiguratorSection"
  );

  systemConfiguratorSection
    .createField("systemProperties")
    .name("System Properties")
    .type("Array")
    .items({
      type: "Symbol",
      validations: []
    });
};

export const down: MigrationFunction = (migration) => {
  const systemConfiguratorSection = migration.editContentType(
    "systemConfiguratorSection"
  );

  systemConfiguratorSection.deleteField("systemProperties");
};
