import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Change recipients validation pattern";

export const up: MigrationFunction = (migration: Migration) => {
  const form = migration.editContentType("form");
  form.editField("recipients").validations([
    {
      regexp: {
        pattern:
          "^((\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+)\\s*,?\\s*){1,4}$"
      },
      message: "You should provide up to 4 valid emails"
    }
  ]);
};

export const down: MigrationFunction = (migration: Migration) => {
  const form = migration.editContentType("form");
  form.editField("recipients").validations([
    {
      regexp: { pattern: "^(?:\b[w@.]+\b[s,]*){1,4}$" },
      message: "You should provide up to 4 valid emails"
    }
  ]);
};
