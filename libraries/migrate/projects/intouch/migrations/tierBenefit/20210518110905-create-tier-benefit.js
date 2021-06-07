const tiers = require("../../variables/tiers/20210222125604");

module.exports.description = "Create content model for Tier Benefit";

module.exports.up = (migration) => {
  const tierBenefit = migration
    .createContentType("tierBenefit")
    .name("Tier Benefit")
    .displayField("name")
    .description("A benefit received by being part of a tier");

  tierBenefit
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  tierBenefit
    .createField("tier")
    .name("Tier")
    .type("Symbol")
    .required(true)
    .validations([
      { unique: true },
      { in: tiers, message: "Please select a tier" }
    ]);

  tierBenefit
    .createField("description")
    .name("Description")
    .type("RichText")
    .required(true)
    .validations([{ nodes: {} }]);

  tierBenefit
    .createField("shortDescription")
    .name("Short Description")
    .type("Text")
    .required(true);

  tierBenefit.changeFieldControl("name", "builtin", "singleLine");
  tierBenefit.changeFieldControl("tier", "builtin", "radio");
  tierBenefit.changeFieldControl("description", "builtin", "richTextEditor");
  tierBenefit.changeFieldControl(
    "shortDescription",
    "builtin",
    "multipleLine",
    {
      helpText:
        "This will be needed in the email that is sent to people joining a new tier."
    }
  );
};

module.exports.down = (migration) => migration.deleteContentType("tierBenefit");
