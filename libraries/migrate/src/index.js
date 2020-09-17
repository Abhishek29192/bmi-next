"use strict";

const contentTypes = require("require-dir")(`${__dirname}/content-types`);

module.exports = function (migration) {
  const argv = process.argv.slice(2);

  Object.entries(contentTypes).forEach(
    ([, { name, description = null, displayField = null, fields }]) => {
      const id = name.charAt(0).toLowerCase() + name.slice(1).replace(/ /g, "");
      if (argv.includes("-d")) {
        migration.deleteContentType(id);
      }
      const contentType = migration.createContentType(id).name(name);
      if (description) {
        contentType.description(description);
      }
      if (displayField) {
        contentType.displayField(displayField);
      }

      fields.forEach(({ id, ...options }) =>
        contentType.createField(id, options)
      );
    }
  );
};
