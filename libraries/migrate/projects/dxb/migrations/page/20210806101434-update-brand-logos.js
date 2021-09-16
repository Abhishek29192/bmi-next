const previousIcons = require("../../variables/icons/20210512134828").brands;
const newIcons = require("../../variables/icons/20210803135831").brands;

module.exports.description = "Update brand logos to latest available";

const contentTypeName = "page";
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
