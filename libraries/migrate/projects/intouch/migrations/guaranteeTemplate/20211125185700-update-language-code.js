module.exports.description = "Add 'it' to valid languageCode values";

const previousValidations = require("../../variables/languageCode/20210831102636");
const newValidations = require("../../variables/languageCode/20211125185700");

module.exports.up = (migration) => {
  migration
    .editContentType("guaranteeTemplate")
    .editField("languageCode")
    .validations([
      {
        in: newValidations
      }
    ]);
};

module.exports.down = (migration) => {
  migration
    .editContentType("guaranteeTemplate")
    .editField("languageCode")
    .validations([
      {
        in: previousValidations
      }
    ]);
};
