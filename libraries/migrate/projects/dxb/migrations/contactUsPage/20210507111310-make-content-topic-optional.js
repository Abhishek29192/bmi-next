"use strict";

module.exports.description = "Make Content Topics field optional";

module.exports.up = (migration) => {
  migration
    .editContentType("contactUsPage")
    .editField("contentTopics")
    .required(false);
};

module.exports.down = (migration) => {
  migration
    .editContentType("contactUsPage")
    .editField("contentTopics")
    .required(true);
};
