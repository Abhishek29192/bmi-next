import type Migration from "contentful-migration";

module.exports.description =
  "Add guarantee condition fields for double acceptance";

module.exports.up = (migration: Migration) => {
  const guaranteeTemplate = migration.editContentType("guaranteeTemplate");

  guaranteeTemplate
    .createField("onerousConditionsSummary")
    .name("Onerous Conditions Summary")
    .type("Text");

  guaranteeTemplate
    .createField("onerousConditionsText")
    .name("Onerous Conditions Text")
    .type("RichText");

  guaranteeTemplate.changeFieldControl(
    "onerousConditionsSummary",
    "builtin",
    "multipleLine"
  );
  guaranteeTemplate.changeFieldControl(
    "onerousConditionsText",
    "builtin",
    "richTextEditor",
    {
      helpText: "Markdown content"
    }
  );
};

module.exports.down = (migration: Migration) => {
  const guaranteeTemplate = migration.editContentType("guaranteeTemplate");

  guaranteeTemplate.deleteField("onerousConditionsSummary");
  guaranteeTemplate.deleteField("onerousConditionsText");
};
