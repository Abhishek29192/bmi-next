"use strict";

const icons = require("../../variables/icons/20201110150955");

module.exports.description = "Update icons to use a variable file";

module.exports.up = (migration) => {
  const link = migration.editContentType("link");

  link.editField("icon", {
    validations: [{ in: icons }]
  });
};

module.exports.down = (migration) => {
  const link = migration.editContentType("link");

  link.editField("icon", {
    validations: [
      {
        in: [
          "Facebook",
          "Twitter",
          "LinkedIn",
          "User",
          "BMI",
          "Phone",
          "Mail",
          "YouTube",
          "Icopal",
          "Monier",
          "Monarplan",
          "Arrow",
          "Zanda",
          "AeroDek"
        ]
      }
    ]
  });
};
