import icons from "../../variables/icons/20201110150955.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Update icons to use a variable file";

export const up: MigrationFunction = (migration) => {
  const link = migration.editContentType("link");

  link.editField("icon", {
    type: "Symbol",
    validations: [{ in: icons }]
  });
};

export const down: MigrationFunction = (migration) => {
  const link = migration.editContentType("link");

  link.editField("icon", {
    type: "Symbol",
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
