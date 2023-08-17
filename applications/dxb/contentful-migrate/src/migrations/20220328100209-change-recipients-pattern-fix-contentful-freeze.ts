import type { MigrationFunction } from "contentful-migration";

export const description = "Change recipients pattern to fix contentful freeze";

export const up: MigrationFunction = (migration) => {
  const form = migration.editContentType("form");
  form.editField("recipients").validations([
    {
      regexp: {
        pattern: "^(\\w[\\w.-]*@([\\w-]+\\.)+[\\w-]+\\s*,?\\s*){1,4}$"
      },
      message: "You should provide up to 4 valid emails"
    }
  ]);
};

export const down: MigrationFunction = (migration) => {
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
