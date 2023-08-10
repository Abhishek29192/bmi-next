import { brands } from "../variables/icons/20220404105849.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Brand";

export const up: MigrationFunction = (migration) => {
  const brand = migration
    .createContentType("brand")
    .name("Brand")
    .displayField("title")
    .description("");

  brand.createField("title").name("Title").type("Symbol").required(true);

  brand
    .createField("brandLogo")
    .name("Brand")
    .type("Symbol")
    .validations([{ in: brands }])
    .required(true);

  brand.createField("subtitle").name("Subtitle").type("Symbol");

  brand.createField("path").name("CTA").type("Symbol");

  brand.changeFieldControl("subtitle", "builtin", "singleLine");
  brand.changeFieldControl("path", "builtin", "urlEditor");
};

export const down: MigrationFunction = (migration) => {
  migration.deleteContentType("brand");
};
