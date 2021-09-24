"use strict";

module.exports.description = "Add Branch Types and options";

module.exports.up = async (
  migration,
  { makeRequest, accessToken, spaceId }
) => {
  const roofer = migration.editContentType("roofer");

  roofer
    .createField("branchType")
    .name("Type of branch")
    .type("Array")
    .items({
      type: "Symbol",
      validations: [
        {
          in: [
            "Headquarters",
            "Country offices",
            "Manufacturing and export",
            "Technical centre & BMI academy"
          ]
        }
      ]
    });

  roofer.moveField("branchType").afterField("type");

  roofer.changeFieldControl("branchType", "builtin", "checkbox");
};

module.exports.down = (migration) => {
  const roofer = migration.editContentType("roofer");

  roofer.deleteField("branchType");
};
