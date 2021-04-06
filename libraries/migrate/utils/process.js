"use strict";

module.exports.isDryRun = Boolean(
  process.argv.find((arg) => arg.includes("--dry-run") || arg.includes("-d"))
);
