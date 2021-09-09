const previousIcons = require("../../variables/icons/20210803135831");
const newIcons = require("../../variables/icons/20210824154700");

module.exports.description = "Update brand logos to latest available";

const contentTypeName = "teamPage";
const fieldName = "brandLogo";

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
