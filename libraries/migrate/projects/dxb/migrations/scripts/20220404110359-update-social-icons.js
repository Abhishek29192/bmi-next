const previousIcons = require("../../variables/icons/20210824154700");
const newIcons = require("../../variables/icons/20220404105849");

module.exports.description = "Update social logos to latest available";

const contentTypeName = "link";
const fieldName = "icon";

module.exports.up = (migration) => {
  migration.editContentType(contentTypeName).editField(fieldName, {
    validations: [{ in: newIcons }]
  });
};

module.exports.down = (migration) => {
  migration.editContentType(contentTypeName).editField(fieldName, {
    validations: [{ in: previousIcons }]
  });
};
