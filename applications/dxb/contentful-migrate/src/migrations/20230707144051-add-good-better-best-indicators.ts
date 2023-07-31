import type { MigrationFunction } from "contentful-migration";

export const description = "Add Good/Better/Best indicators";

const indicators: { name: string; label: string; icons: string[] }[] = [
  {
    name: "gbbGoodIndicator",
    label: "Good Better Best. Good indicator",
    icons: ["Thumb Up"]
  },
  {
    name: "gbbBetterIndicator",
    label: "Good Better Best. Better indicator",
    icons: ["Heart"]
  },
  {
    name: "gbbBestIndicator",
    label: "Good Better Best. Best indicator",
    icons: ["Star"]
  }
];

export const up: MigrationFunction = async (migration) => {
  const resources = migration.editContentType("resources");

  indicators.forEach((indicator) => {
    resources
      .createField(indicator.name)
      .name(indicator.label)
      .type("Symbol")
      .validations([{ in: indicator.icons }]);
    resources.changeFieldControl("gbbGoodIndicator", "builtin", "dropdown");
  });

  migration.transformEntries({
    contentType: "resources",
    from: ["gbbGoodIndicator", "gbbBetterIndicator", "gbbBestIndicator"],
    to: ["gbbGoodIndicator", "gbbBetterIndicator", "gbbBestIndicator"],
    transformEntryForLocale: () => ({
      gbbGoodIndicator: "Thumb Up",
      gbbBetterIndicator: "Heart",
      gbbBestIndicator: "Star"
    })
  });
};

export const down: MigrationFunction = (migration) => {
  const resources = migration.editContentType("resources");

  indicators.forEach((indicator) => {
    resources.deleteField(indicator.name);
  });
};
