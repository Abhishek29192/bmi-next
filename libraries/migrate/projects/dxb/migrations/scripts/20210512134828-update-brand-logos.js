const previousIcons = require("../../variables/icons/20210324110455");
const icons = require("../../variables/icons/20210512134828");

module.exports.description = "Update to the latest set of brand icons";

module.exports.up = (migration) => {
  const link = migration.editContentType("link");

  link.editField("icon", {
    validations: [{ in: icons }]
  });
};

module.exports.down = (migration) => {
  const link = migration.editContentType("link");

  link.editField("icon", {
    validations: [{ in: previousIcons }]
  });
};
