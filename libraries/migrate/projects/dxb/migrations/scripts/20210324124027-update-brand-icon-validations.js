const previousIcons = require("../../variables/icons/20201111103444").brands;
const newIcons = require("../../variables/icons/20210324110455").brands;

module.exports.description = "Update brand logos to latest available";

const contentTypeName = "brandLandingPage";
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
