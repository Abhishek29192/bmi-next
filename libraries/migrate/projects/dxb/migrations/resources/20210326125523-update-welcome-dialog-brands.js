const previousIcons = require("../../variables/icons/20201111103444").brands;
const newIcons = require("../../variables/icons/20210324110455").brands;

module.exports.description = "Update welcome dialog brands to latest available";

const contentTypeName = "resources";
const fieldName = "welcomeDialogBrands";

module.exports.up = (migration) => {
  migration.editContentType(contentTypeName).editField(fieldName, {
    items: {
      type: "Symbol",
      validations: [{ in: newIcons }]
    }
  });
};

module.exports.down = (migration) => {
  migration.editContentType(contentTypeName).editField(fieldName, {
    items: {
      type: "Symbol",
      validations: [{ in: previousIcons }]
    }
  });
};
