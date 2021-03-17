const addVideoFieldMigration = require("./20210316124934-add-featured-video-field.js");

module.exports.description = "Remove featuredVideo field.";

module.exports.up = (migration) => {
  addVideoFieldMigration.down(migration);
};

module.exports.down = (migration) => {
  addVideoFieldMigration.up(migration);
};
