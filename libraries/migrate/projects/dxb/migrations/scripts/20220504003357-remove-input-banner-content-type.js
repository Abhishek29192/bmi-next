const inputBannerMigration = require("./20201117005321-create-input-banner-content-type.js");
const nameFieldIBMigration = require("./20220419133700-change-source-content-type-for-name-field-for-input-banner.js");
const retryFieldMigration = require("./20210301151440-add-retry-fields.js");
module.exports.description = "remove input banner content type";

module.exports.up = (migration) => {
  inputBannerMigration.down(migration);
};

module.exports.down = (migration) => {
  inputBannerMigration.up(migration);
  retryFieldMigration.up(migration);
  nameFieldIBMigration.up(migration);
};
