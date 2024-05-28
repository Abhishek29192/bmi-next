import { getLocales } from "@bmi-digital/contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add ECMAScript field to embeddedScriptSection";

export const up: MigrationFunction = async (migration, context) => {
  if (!context) {
    throw new Error("Context was not provided");
  }

  const embeddedScriptSection = migration.editContentType(
    "embeddedScriptSection"
  );

  const defaultValue = (await getLocales(context.makeRequest)).items.reduce(
    (defaultValue, localeInfo) => {
      return { ...defaultValue, [localeInfo.code]: false };
    },
    {}
  );

  embeddedScriptSection
    .createField("ecmaScript")
    .name("Is the script an ECMAScript module?")
    .type("Boolean")
    .localized(true)
    .required(true)
    .defaultValue(defaultValue);

  embeddedScriptSection.changeFieldControl("ecmaScript", "builtin", "boolean", {
    helpText:
      "Define whether the script is ECMAScript module or CommonJS. If the script has a file extension of `.cjs` or `.mjs`, it will override this value."
  });

  migration.transformEntries({
    contentType: "embeddedScriptSection",
    from: ["ecmaScript"],
    to: ["ecmaScript"],
    transformEntryForLocale() {
      return { ecmaScript: false };
    }
  });
};

export const down: MigrationFunction = async (migration) => {
  const embeddedScriptSection = migration.editContentType(
    "embeddedScriptSection"
  );
  embeddedScriptSection.deleteField("ecmaScript");
};
