const tiers = require("../../variables/tiers/20210222125604");

module.exports.description = "Create content model for Benefit";

module.exports.up = (migration) => {
  const benefit = migration
    .createContentType("benefit")
    .name("Benefit")
    .displayField("name")
    .description("A benefit received by being part of a tier");

  benefit
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  benefit
    .createField("tier")
    .name("Tier")
    .type("Symbol")
    .required(true)
    .validations([
      { unique: true },
      { in: tiers, message: "Please select a tier" }
    ]);

  benefit
    .createField("description")
    .name("Description")
    .type("RichText")
    .required(true)
    .validations([{ nodes: {} }]);

  benefit.changeFieldControl("name", "builtin", "singleLine");
  benefit.changeFieldControl("tier", "builtin", "radio");
  benefit.changeFieldControl("description", "builtin", "richTextEditor");
};

module.exports.down = (migration) => migration.deleteContentType("benefit");
