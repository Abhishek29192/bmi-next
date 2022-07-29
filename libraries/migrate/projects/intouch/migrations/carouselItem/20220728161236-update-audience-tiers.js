const tiers = require("../../variables/tiers/20210222125604");

module.exports.description = "Update Audience Tiers";

module.exports.up = (migration) => {
  const carouselItem = migration.editContentType("carouselItem");

  carouselItem.editField("audienceTiers").items({
    type: "Symbol",
    validations: [{ in: ["T1", "T2", "T3", "T4", "T5", "T6", "T7"] }]
  });
};

module.exports.down = (migration) => {
  const carouselItem = migration.editContentType("carouselItem");

  carouselItem.editField("audienceTiers").items({
    type: "Symbol",
    validations: [{ in: tiers }]
  });
};
