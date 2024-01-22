import { getExtensions } from "@bmi-digital/contentful-migration";
import { internalName } from "../variables/helpText/20210421160910.js";
import toolTypes from "../variables/toolTypes/20210928085352.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create account page content type";

export const up: MigrationFunction = async (migration, context) => {
  const accountPage = migration
    .createContentType("accountPage")
    .name("Account Page");
  const site = migration.editContentType("site");

  accountPage
    .createField("name")
    .name("Name")
    .type("Symbol")
    .localized(true)
    .required(true);
  accountPage.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  accountPage.displayField("name");

  accountPage
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .localized(true)
    .required(true)
    .validations([{ unique: true }]);

  accountPage
    .createField("salutation")
    .name("Salutation")
    .type("Symbol")
    .localized(true)
    .required(true);

  accountPage.changeFieldControl("salutation", "builtin", "singleLine", {
    helpText:
      "You can use variable {{name}} in the salutation. i.e. Hello, {{name}}"
  });

  accountPage
    .createField("description")
    .name("Description")
    .type("Symbol")
    .localized(true)
    .required(true);
  accountPage.changeFieldControl("description", "builtin", "singleLine", {
    helpText:
      "You can use variable {{role}} in the description. i.e. You are logged in as {{role}}. Please find out all your available tools"
  });

  accountPage
    .createField("featuredMedia")
    .name("Featured Image")
    .type("Link")
    .validations([{ linkContentType: ["image"] }])
    .linkType("Entry")
    .required(true)
    .localized(true);

  accountPage
    .createField("titleForToolSection")
    .name("Title for tool section")
    .type("Symbol")
    .localized(true)
    .required(true);

  accountPage
    .createField("titleForServiceSupportSection")
    .name("Title for service support section")
    .type("Symbol")
    .localized(true)
    .required(true);

  accountPage
    .createField("allowTools")
    .name("Allow Tools")
    .type("Array")
    .localized(true)
    .required(true)
    .items({
      type: "Symbol",
      validations: [
        {
          in: toolTypes
        }
      ]
    });

  accountPage.changeFieldControl("allowTools", "builtin", "checkbox", {
    helpText: "Please choose tools that will be allowed to user."
  });
  accountPage
    .createField("serviceSupportCards")
    .name("Service support cards")
    .type("Array")
    .localized(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["contactDetails"] }],
      linkType: "Entry"
    });

  const extensions = await getExtensions(context!.makeRequest);
  const slugGenerator = extensions.items.find(
    (item) => item.extension.name === "Slug Generator"
  );

  if (!slugGenerator) {
    throw new Error(`Slug Generator Extension was not found`);
  }

  accountPage.changeFieldControl("slug", "extension", slugGenerator.sys.id, {
    helpText:
      'This will define the URL of the page. The page will be created at "https://www.bmigroup.com/{country-code}/{slug}".'
  });

  site
    .createField("accountPage")
    .name("Account Pager")
    .type("Link")
    .validations([{ linkContentType: ["accountPage"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = async (migration) => {
  migration.deleteContentType("accountPage");
  const site = migration.editContentType("site");
  site.deleteField("accountPage");
};
