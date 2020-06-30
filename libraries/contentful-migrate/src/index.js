"use strict";

const contentTypes = require("require-dir")(`${__dirname}/content-types`);

module.exports = function (migration) {
  const argv = process.argv.slice(2);

  Object.entries(contentTypes).forEach(([name, fields]) => {
    if (argv.includes("-d")) migration.deleteContentType(name.toLowerCase());
    const contentType = migration
      .createContentType(name.toLowerCase())
      .name(name);

    Object.entries(fields).forEach(([fieldName, field]) =>
      contentType.createField(field.name && fieldName, field)
    );
  });
};
