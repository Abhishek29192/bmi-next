const tiers = require("../../variables/tiers/20210222125604");

module.exports.description = "Add more tier to Tier Benefit";

module.exports.up = (migration) => {
  const tierBenefit = migration.editContentType("tierBenefit");

  tierBenefit.editField("tier", {
    validations: [
      { unique: true },
      {
        in: ["T1", "T2", "T3", "T4", "T5", "T6", "T7"],
        message: "Please select a tier"
      }
    ]
  });

  tierBenefit.changeFieldControl("tier", "builtin", "radio");
};

module.exports.down = (migration) => {
  const tierBenefit = migration.editContentType("tierBenefit");

  tierBenefit.editField("tier", {
    validations: [
      { unique: true },
      {
        in: tiers,
        message: "Please select a tier"
      }
    ]
  });

  tierBenefit.changeFieldControl("tier", "builtin", "radio");
};
