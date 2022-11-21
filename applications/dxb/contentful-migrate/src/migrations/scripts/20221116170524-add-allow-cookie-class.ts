import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import cookieTypes from "../../variables/cookieTypes/202211171557";

export const description = "Add allowed cookie classes on Iframe";

export const up: MigrationFunction = (migration: Migration) => {
  const iframe = migration.editContentType("iframe");

  iframe
    .createField("allowCookieClasses")
    .name("Allow Cookie Classes")
    .type("Array")
    .items({
      type: "Symbol",
      validations: [
        {
          in: cookieTypes
        }
      ]
    });

  iframe.moveField("allowCookieClasses").afterField("height");

  iframe.changeFieldControl("allowCookieClasses", "builtin", "checkbox", {
    helpText:
      "Please choose the one or more type of cookies that will be allowed for tracking on from this Iframe URL / Site."
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const iframe = migration.editContentType("iframe");
  iframe.deleteField("allowCookieClasses");
};
