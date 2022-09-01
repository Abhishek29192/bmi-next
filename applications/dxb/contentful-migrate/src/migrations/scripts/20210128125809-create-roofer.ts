import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create roofer content type";

export const up: MigrationFunction = (migration: Migration) => {
  const roofer = migration
    .createContentType("roofer")
    .name("Roofer")
    .displayField("name")
    .description("Company details for this roofer.");

  roofer.createField("name").name("Company name").type("Symbol").required(true);

  roofer
    .createField("location")
    .name("Location")
    .type("Location")
    .required(true);

  roofer.changeFieldControl("location", "builtin", "locationEditor", {
    helpText: "Please pick a location and enter the address in the field below."
  });

  roofer.createField("address").name("Address").type("Symbol").required(true);

  roofer.createField("phone").name("Phone number").type("Symbol");

  roofer
    .createField("email")
    .name("Email")
    .type("Symbol")
    .validations([
      {
        regexp: {
          pattern: "^\\w[\\w.-]*@([\\w-]+\\.)+[\\w-]+$"
        },
        message: "Please enter a valid email address."
      }
    ]);

  roofer
    .createField("website")
    .name("Website")
    .type("Symbol")
    .validations([
      {
        regexp: {
          pattern:
            "^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$"
        },
        message: "Please enter a valid URL."
      }
    ]);

  roofer
    .createField("type")
    .name("Type of roof")
    .type("Array")
    .items({
      type: "Symbol",
      validations: [{ in: ["Pitched roof", "Flat roof"] }]
    });

  roofer.changeFieldControl("type", "builtin", "checkbox");

  roofer
    .createField("certification")
    .name("BMI RoofPro Level")
    .type("Symbol")
    .validations([{ in: ["Partner", "Expert", "Elite"] }]);

  roofer.changeFieldControl("certification", "builtin", "dropdown");

  roofer.createField("summary").name("Summary").type("Symbol");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("roofer");
