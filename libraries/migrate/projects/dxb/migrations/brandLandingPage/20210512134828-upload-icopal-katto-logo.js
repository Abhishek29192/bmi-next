const previousIcons = require("../../variables/icons/20210324110455").brands;
const newIcons = require("../../variables/icons/20210512134828").brands;

module.exports.description = "Adding new brand logos called Icopal Katto.";

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
